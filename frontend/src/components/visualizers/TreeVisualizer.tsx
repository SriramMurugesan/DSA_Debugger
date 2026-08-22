import { motion } from 'framer-motion'

export function TreeVisualizer({ structure }: { structure: any }) {
  const root = structure.data;
  const references = structure.references || {};
  const nameLabel = Object.keys(references).join(', ') || 'Tree';

  const getPointersForNode = (id: string) => {
    return Object.keys(references).filter(key => references[key] === id);
  };

  // A simple recursive component to render tree nodes
  const renderNode = (node: any, level: number = 0) => {
    if (!node || !node.__id__) return null;

    const nodePointers = getPointersForNode(node.__id__);

    return (
      <div key={node.__id__} className="flex flex-col items-center">
        <motion.div
          layout
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-12 h-12 bg-surface border-2 border-primary flex flex-col items-center justify-center rounded-full shadow-sm relative z-10"
        >
          <span className="text-base font-bold text-text truncate px-1">
            {node.val !== undefined ? node.val : (node.value !== undefined ? node.value : '{...}')}
          </span>
          {nodePointers.length > 0 && (
            <div className="absolute -top-10 flex flex-col items-center space-y-1">
              {nodePointers.map((p) => (
                <div key={p} className="flex flex-col items-center">
                  <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded">{p}</span>
                  <div className="w-1 h-2 bg-secondary" />
                </div>
              ))}
            </div>
          )}
        </motion.div>

        {/* Children */}
        {(node.left || node.right || node.children) && (
          <div className="flex justify-center mt-4 space-x-8 relative">
            {node.left && (
               <div className="flex flex-col items-center relative">
                 <div className="absolute -top-4 w-[2px] h-4 bg-primary/40 -rotate-[30deg] origin-bottom translate-x-4" />
                 {renderNode(node.left, level + 1)}
               </div>
            )}
            {node.right && (
               <div className="flex flex-col items-center relative">
                 <div className="absolute -top-4 w-[2px] h-4 bg-primary/40 rotate-[30deg] origin-bottom -translate-x-4" />
                 {renderNode(node.right, level + 1)}
               </div>
            )}
            {node.children && typeof node.children === 'object' && !node.children.__type__ && (
               // Simple object/dict of children for Trie
               Object.entries(node.children.values || node.children).map(([char, childNode]: [string, any], i, arr) => {
                 if (char === '__id__' || char === '__type__') return null;
                 const angle = arr.length > 1 ? -30 + (60 * (i / (arr.length - 1))) : 0;
                 return (
                   <div key={char} className="flex flex-col items-center relative">
                     <div className="absolute -top-4 w-[2px] h-4 bg-primary/40 origin-bottom" style={{ transform: `rotate(${angle}deg)` }} />
                     {renderNode(childNode, level + 1)}
                   </div>
                 );
               })
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto p-4">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {nameLabel}
      </div>
      <div className="py-4">
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
