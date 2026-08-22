import { motion } from 'framer-motion'

export function TreeVisualizer({ structure }: { structure: any }) {
  const root = structure.data;
  const references = structure.references || {};
  
  // Only show references that point to the container itself at the top
  const containerRefs = Object.keys(references).filter(key => references[key] === structure.id);
  const nameLabel = containerRefs.join(', ') || 'Tree';

  const getPointersForNode = (id: string) => {
    return Object.keys(references).filter(key => references[key] === id);
  };

  // A simple recursive component to render tree nodes with orthogonal edges
  const renderNode = (node: any, level: number = 0, childIndex: number = 0, totalSiblings: number = 1, edgeLabel?: string) => {
    if (!node || !node.__id__) return null;

    const nodePointers = getPointersForNode(node.__id__);
    
    // Normalize children for binary/general/trie
    let children: { node: any, edgeLabel?: string }[] = [];
    if (node.left) children.push({ node: node.left, edgeLabel: 'L' });
    if (node.right) children.push({ node: node.right, edgeLabel: 'R' });
    if (node.children) {
      if (node.children.__type__ === 'list' || Array.isArray(node.children.values) || Array.isArray(node.children)) {
        const arr = node.children.values || node.children;
        children.push(...arr.map((c: any) => ({ node: c })));
      } else if (node.children.__type__ === 'dict' || typeof node.children === 'object') {
        const dict = node.children.values || node.children;
        Object.entries(dict).forEach(([char, cNode]) => {
          if (char !== '__id__' && char !== '__type__' && cNode) {
            children.push({ node: cNode, edgeLabel: char });
          }
        });
      }
    }
    
    // Filter out nulls
    children = children.filter(c => c.node && typeof c.node === 'object');
    const hasChildren = children.length > 0;

    return (
      <div key={node.__id__} className="relative flex flex-col items-center px-1 sm:px-4">
        {/* Horizontal line connecting to siblings */}
        {totalSiblings > 1 && (
           <div className={`absolute top-0 h-[2px] bg-primary/40 z-0 ${
              childIndex === 0 ? 'left-1/2 right-0' : 
              childIndex === totalSiblings - 1 ? 'left-0 right-1/2' : 
              'left-0 right-0'
           }`} />
        )}
        
        {/* Vertical line dropping to this child (skip for root) */}
        {level > 0 && (
           <div className="w-[2px] h-6 bg-primary/40 z-0 relative">
             {edgeLabel && (
               <div className="absolute top-1/2 -translate-y-1/2 left-2 bg-surface border border-primary/50 text-primary text-[8px] font-bold px-1 rounded z-20">
                 {edgeLabel}
               </div>
             )}
           </div>
        )}

        <div className="flex flex-col items-center relative z-10">
          <motion.div
            layout
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-12 h-12 bg-surface border-2 border-primary flex flex-col items-center justify-center rounded-full shadow-sm relative"
          >
            <span className="text-base font-bold text-text truncate px-1 flex items-center justify-center">
              {node.val !== undefined ? node.val : (node.value !== undefined ? node.value : (node.data !== undefined ? node.data : ''))}
              {(node.is_end || node.is_word || node.end) && (
                 <span className="text-success text-xs font-bold ml-1">✓</span>
              )}
              {!node.val && !node.value && !node.data && !node.is_end && !node.is_word && !node.end && (
                 <span className="w-2 h-2 bg-primary/40 rounded-full"></span>
              )}
            </span>
            {nodePointers.length > 0 && (
              <div className="absolute -top-10 flex flex-col items-center space-y-1">
                {nodePointers.map((p) => (
                  <div key={p} className="flex flex-col items-center">
                    <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded whitespace-nowrap">{p}</span>
                    <div className="w-1 h-2 bg-secondary" />
                  </div>
                ))}
              </div>
            )}
          </motion.div>

          {hasChildren && (
            <>
              {/* Vertical line dropping from parent */}
              <div className="w-[2px] h-6 bg-primary/40 z-0" />
              <div className="flex justify-center items-start">
                {children.map((child, i) => renderNode(child.node, level + 1, i, children.length, child.edgeLabel))}
              </div>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto p-4 pt-12">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {nameLabel}
      </div>
      <div className="py-4 flex justify-center min-w-max">
        {root === null ? (
           <div className="flex flex-col items-center relative mt-4">
             {references['root'] !== undefined ? (
               <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded mb-2">root</span>
             ) : (
               <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded mb-2">root</span>
             )}
             <div className="w-1 h-4 bg-secondary mb-2" />
             <span className="text-muted font-mono text-xs font-bold px-2 py-1 bg-surface border border-border rounded">null</span>
           </div>
        ) : (
          renderNode(root)
        )}
      </div>
    </div>
  )
}
