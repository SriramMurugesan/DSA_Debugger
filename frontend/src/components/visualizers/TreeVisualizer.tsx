import { motion } from 'framer-motion'

interface Pointer {
  name: string;
  value: any;
}

export function TreeVisualizer({ name, data, pointers }: { name: string, data: any, pointers: Pointer[] }) {
  // A simple recursive component to render tree nodes
  const renderNode = (node: any, level: number = 0) => {
    if (!node || !node.__id__) return null;
    
    const nodePointers = pointers.filter(p => p.value && p.value.__id__ === node.__id__);
    
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
            <div className="absolute -right-12 top-0 flex flex-col items-start space-y-1">
              {nodePointers.map((p) => (
                <span key={p.name} className="text-[10px] font-mono text-secondary bg-secondary/10 px-1 rounded border border-secondary/20">← {p.name}</span>
              ))}
            </div>
          )}
        </motion.div>
        
        {/* Children */}
        {(node.left || node.right) && (
          <div className="flex justify-center mt-4 space-x-8 relative">
            {/* Connecting Lines could be drawn here, but we will use simple CSS for now */}
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
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto p-4">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {name} (Tree)
      </div>
      <div className="py-4">
        {renderNode(data)}
      </div>
    </div>
  )
}
