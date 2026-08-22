import { motion } from 'framer-motion'

interface Pointer {
  name: string;
  value: any;
}

export function DoublyLinkedListVisualizer({ name, data, pointers }: { name: string, data: any, pointers: Pointer[] }) {
  // Flatten doubly linked list into an array for visualization
  const nodes = [];
  let curr = data;
  let safety = 0;
  while (curr && curr.__id__ && safety < 50) {
    nodes.push(curr);
    curr = curr.next; // Assuming standard 'next' pointer
    safety++;
  }

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {name} (Doubly LinkedList)
      </div>
      <div className="flex items-center space-x-2 py-8 px-4">
        {nodes.length > 0 && (
           <div className="flex items-center">
             <span className="text-muted font-mono text-xs">null</span>
             <div className="w-8 h-1 bg-primary/50 relative ml-2 mr-2">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 border-t-4 border-b-4 border-r-4 border-transparent border-r-primary/50 w-0 h-0" />
             </div>
           </div>
        )}
        {nodes.map((node: any, idx: number) => {
          // Find pointers pointing to this node
          const nodePointers = pointers.filter(p => p.value && p.value.__id__ === node.__id__);
          
          return (
            <div key={node.__id__} className="flex items-center">
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="w-16 h-12 bg-surface border-2 border-primary/50 flex flex-col items-center justify-center rounded-lg shadow-sm relative"
              >
                <span className="text-base font-bold text-text truncate px-1">{node.val !== undefined ? node.val : (node.value !== undefined ? node.value : '{...}')}</span>
                
                {/* Render Pointers */}
                {nodePointers.length > 0 && (
                  <div className="absolute -bottom-8 flex flex-col items-center space-y-1">
                    {nodePointers.map((p) => (
                      <div key={p.name} className="flex flex-col items-center">
                        <div className="w-1 h-2 bg-secondary" />
                        <span className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded">{p.name}</span>
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
