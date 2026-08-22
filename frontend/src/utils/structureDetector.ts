export type VisualizationType =
  | "primitive"
  | "array"
  | "linked-list"
  | "doubly-linked-list"
  | "binary-tree"
  | "trie"
  | "graph"
  | "object"
  | "set"
  | "dict"
  | "tuple";

export interface NormalizedStructure {
  type: VisualizationType;
  id: string; // A unique stable ID for this structure
  data: any; // The structure specific data (e.g., nodes for linked lists, root for trees)
  references: Record<string, string>; // Maps variable names to node IDs or root IDs
}

// Helper to fully resolve an object from memory
function resolveMemory(refId: string, memory: Record<string, any>, visited = new Set<string>()): any {
  if (!memory[refId]) return null;
  if (visited.has(refId)) return { __circular_ref__: refId };
  
  visited.add(refId);
  const obj = memory[refId];
  
  if (obj.__type__ === 'list' || obj.__type__ === 'tuple' || obj.__type__ === 'set') {
    return {
      __type__: obj.__type__,
      __id__: refId,
      values: obj.values.map((v: any) => v && v.__ref__ ? resolveMemory(v.__ref__, memory, visited) : v)
    };
  }
  
  if (obj.__type__ === 'dict') {
    const res: any = { __type__: 'dict', __id__: refId, values: {} };
    for (const [k, v] of Object.entries(obj.values)) {
      res.values[k] = (v as any) && (v as any).__ref__ ? resolveMemory((v as any).__ref__, memory, visited) : v;
    }
    return res;
  }

  // Custom objects
  const res: any = { __type__: obj.__type__, __id__: refId };
  for (const [k, v] of Object.entries(obj)) {
    if (k === '__type__') continue;
    res[k] = (v as any) && (v as any).__ref__ ? resolveMemory((v as any).__ref__, memory, visited) : v;
  }
  return res;
}

export function detectStructures(variables: Record<string, any>, memory: Record<string, any>): { structures: NormalizedStructure[], simpleVariables: Record<string, any> } {
  const structures: NormalizedStructure[] = [];
  const simpleVariables: Record<string, any> = {};
  
  const refToVars: Record<string, string[]> = {};
  
  // 1. Group variables by what they point to
  for (const [varName, varVal] of Object.entries(variables)) {
    if (varVal && typeof varVal === 'object' && varVal.__ref__) {
      const refId = varVal.__ref__;
      if (!refToVars[refId]) refToVars[refId] = [];
      refToVars[refId].push(varName);
    } else {
      simpleVariables[varName] = varVal;
    }
  }

  const processedRefIds = new Set<string>();

  // Helper to get connected nodes for Linked List
  const traverseLinkedList = (startRef: string) => {
    const nodes = [];
    let currRef: string | null = startRef;
    const visited = new Set<string>();
    
    while (currRef && memory[currRef] && !visited.has(currRef)) {
      visited.add(currRef);
      const obj = memory[currRef];
      processedRefIds.add(currRef);
      
      const nodeObj: any = {
        id: currRef,
        value: obj.data ?? obj.value ?? obj.val ?? null,
        next: obj.next && obj.next.__ref__ ? obj.next.__ref__ : null,
        prev: obj.prev && obj.prev.__ref__ ? obj.prev.__ref__ : null,
      };
      nodes.push(nodeObj);
      currRef = nodeObj.next;
    }
    return nodes;
  };

  // Helper to get connected nodes for Binary Tree/General Tree/Trie
  const traverseTree = (startRef: string) => {
    const root = resolveMemory(startRef, memory); // Deep resolve for trees
    // Mark all tree nodes as processed
    const markProcessed = (node: any) => {
      if (!node || typeof node !== 'object') return;
      if (node.__id__) processedRefIds.add(node.__id__);
      if (node.left) markProcessed(node.left);
      if (node.right) markProcessed(node.right);
      
      if (node.children) {
        const children = node.children.values || node.children;
        if (Array.isArray(children)) {
          children.forEach(markProcessed);
        } else if (typeof children === 'object') {
          Object.values(children).forEach(markProcessed);
        }
      }
    };
    markProcessed(root);
    return root;
  };

  // 2. Identify structures from the memory pool based on variables
  for (const [refId, varNames] of Object.entries(refToVars)) {
    if (processedRefIds.has(refId)) continue; 

    const obj = memory[refId];
    if (!obj) continue;

    const references: Record<string, string> = {};
    for (const v of varNames) references[v] = refId;

    // 1. Detect Doubly Linked List Container
    if ('head' in obj && (
      (obj.head && obj.head.__ref__ && memory[obj.head.__ref__] && 'prev' in memory[obj.head.__ref__] && 'next' in memory[obj.head.__ref__]) ||
      (obj.head === null && typeof obj.__type__ === 'string' && obj.__type__.toLowerCase().includes('doubly'))
    )) {
      const nodes = obj.head && obj.head.__ref__ ? traverseLinkedList(obj.head.__ref__) : [];
      nodes.forEach(n => { if (refToVars[n.id]) refToVars[n.id].forEach(v => references[v] = n.id); });
      if (obj.head && obj.head.__ref__) references['head'] = obj.head.__ref__;
      structures.push({ type: 'doubly-linked-list', id: refId, data: nodes, references });
      processedRefIds.add(refId);
      continue;
    }
    // 2. Detect Singly Linked List Container
    if ('head' in obj && (
      (obj.head && obj.head.__ref__ && memory[obj.head.__ref__] && 'next' in memory[obj.head.__ref__]) ||
      (obj.head === null) // If it has 'head' but it's null, assume Singly Linked List
    )) {
      const nodes = obj.head && obj.head.__ref__ ? traverseLinkedList(obj.head.__ref__) : [];
      nodes.forEach(n => { if (refToVars[n.id]) refToVars[n.id].forEach(v => references[v] = n.id); });
      if (obj.head && obj.head.__ref__) references['head'] = obj.head.__ref__;
      structures.push({ type: 'linked-list', id: refId, data: nodes, references });
      processedRefIds.add(refId);
      continue;
    }
    // 3. Detect Tree Container (Binary, General, Trie)
    if ('root' in obj) {
      let treeType = 'binary-tree';
      const rootNode = obj.root && obj.root.__ref__ ? memory[obj.root.__ref__] : null;
      if (rootNode) {
        if ('children' in rootNode) {
          const childrenObj = rootNode.children && rootNode.children.__ref__ ? memory[rootNode.children.__ref__] : null;
          if (childrenObj && childrenObj.__type__ === 'dict') {
            treeType = 'trie';
          }
        }
      } else if (typeof obj.__type__ === 'string' && obj.__type__.toLowerCase().includes('trie')) {
        treeType = 'trie';
      }

      const root = obj.root && obj.root.__ref__ ? traverseTree(obj.root.__ref__) : null;
      const allTreeRefs: Record<string, string> = { ...references };
      Object.keys(refToVars).forEach(rId => { if (processedRefIds.has(rId)) refToVars[rId].forEach(v => allTreeRefs[v] = rId); });
      if (obj.root && obj.root.__ref__) allTreeRefs['root'] = obj.root.__ref__;
      structures.push({ type: treeType as VisualizationType, id: refId, data: root, references: allTreeRefs });
      processedRefIds.add(refId);
      continue;
    }
    
    // 4. Detect Doubly Linked List Node
    if ('prev' in obj && 'next' in obj && ('data' in obj || 'value' in obj || 'val' in obj)) {
      const nodes = traverseLinkedList(refId);
      nodes.forEach(n => { if (refToVars[n.id]) refToVars[n.id].forEach(v => references[v] = n.id); });
      structures.push({ type: 'doubly-linked-list', id: refId, data: nodes, references });
    }
    // 5. Detect Singly Linked List Node
    else if ('next' in obj && ('data' in obj || 'value' in obj || 'val' in obj)) {
      const nodes = traverseLinkedList(refId);
      nodes.forEach(n => { if (refToVars[n.id]) refToVars[n.id].forEach(v => references[v] = n.id); });
      structures.push({ type: 'linked-list', id: refId, data: nodes, references });
    }
    // 6. Detect Tree Node (Binary, General, Trie)
    else if ('left' in obj || 'right' in obj || 'children' in obj) {
      let treeType = 'binary-tree';
      if ('children' in obj) {
        const childrenObj = obj.children && obj.children.__ref__ ? memory[obj.children.__ref__] : null;
        if (childrenObj && childrenObj.__type__ === 'dict') {
          treeType = 'trie';
        }
      }
      
      const root = traverseTree(refId);
      const allTreeRefs: Record<string, string> = { ...references };
      Object.keys(refToVars).forEach(rId => { if (processedRefIds.has(rId)) refToVars[rId].forEach(v => allTreeRefs[v] = rId); });
      structures.push({ type: treeType as VisualizationType, id: refId, data: root, references: allTreeRefs });
    }
    // 8. Detect Graph Adjacency List
    else if (obj.__type__ === 'dict' && Object.keys(obj.values).length > 0 && Object.values(obj.values).every((v: any) => v && (v.__type__ === 'list' || v.__type__ === 'set'))) {
      const resolved = resolveMemory(refId, memory);
      processedRefIds.add(refId);
      structures.push({ type: 'graph', id: refId, data: resolved.values, references });
    }
    // 9. Detect Arrays/Lists
    else if (obj.__type__ === 'list' || obj.__type__ === 'tuple') {
      const resolved = resolveMemory(refId, memory);
      processedRefIds.add(refId);
      structures.push({ type: 'array', id: refId, data: resolved.values, references });
    }
    // 10. Detect Dictionaries/Sets/Objects
    else {
      const resolved = resolveMemory(refId, memory);
      processedRefIds.add(refId);
      structures.push({ type: 'object', id: refId, data: resolved, references });
    }
  }

  // Find any variables that were pointing to mid-structure nodes and attach them properly
  // This is mostly handled by the traverse functions collecting refs.

  return { structures, simpleVariables };
}
