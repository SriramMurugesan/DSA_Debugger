import { motion } from 'framer-motion'

export function DoublyLinkedListVisualizer({ structure }: { structure: any }) {
  const nodes = structure.data || [];
  const references = structure.references || {};
  const nameLabel = Object.keys(references).join(', ') || 'Doubly Linked List';

  const getPointersForNode = (id: string) => {
    return Object.keys(references).filter(key => references[key] === id);
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {nameLabel}
      </div>
      <div className="flex items-center space-x-2 py-8 px-4">
        {nodes.length === 0 && (
           <div className="flex flex-col items-center relative mt-4">
             {references['head'] !== undefined ? (
               <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded mb-2">head</span>
             ) : (
               <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded mb-2">head</span>
             )}
             <div className="w-1 h-4 bg-secondary mb-2" />
             <span className="text-muted font-mono text-xs font-bold px-2 py-1 bg-surface border border-border rounded">null</span>
           </div>
        )}
        {nodes.length > 0 && (
           <div className="flex items-center">
             <span className="text-muted font-mono text-xs">null</span>
             <div className="w-8 h-1 bg-primary/50 relative ml-2 mr-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-primary/50 w-0 h-0" />
             </div>
           </div>
        )}
        {nodes.map((node: any, idx: number) => {
          const nodePointers = getPointersForNode(node.id);
          
          return (
            <div key={node.id} className="flex items-center">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-12 bg-surface border-2 border-primary/50 flex flex-col items-center justify-center rounded-lg shadow-sm relative"
              >
                <span className="text-base font-bold text-text truncate px-1">
                  {node.value !== undefined && node.value !== null ? String(node.value) : '{...}'}
                </span>
                
                {/* Render Pointers */}
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
              
              {/* Double Arrow */}
              {idx < nodes.length - 1 && (
                <div className="w-8 h-2 flex flex-col justify-between relative ml-2 mr-2">
                  <div className="w-full h-[2px] bg-primary/50 relative">
                      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-[2px] border-t-[3px] border-b-[3px] border-l-[4px] border-transparent border-l-primary/50 w-0 h-0" />
                  </div>
                  <div className="w-full h-[2px] bg-primary/50 relative">
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-[2px] border-t-[3px] border-b-[3px] border-r-[4px] border-transparent border-r-primary/50 w-0 h-0" />
                  </div>
                </div>
              )}
            </div>
          )
        })}
        {nodes.length > 0 && (
           <div className="flex items-center">
             <div className="w-8 h-1 bg-primary/50 relative ml-2 mr-2">
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 border-t-4 border-b-4 border-l-4 border-transparent border-l-primary/50 w-0 h-0" />
             </div>
             <span className="text-muted font-mono text-xs">null</span>
           </div>
        )}
      </div>
    </div>
  )
}
