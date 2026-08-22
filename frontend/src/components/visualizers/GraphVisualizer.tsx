import { motion } from 'framer-motion'

export function GraphVisualizer({ structure }: { structure: any }) {
  const adjacencyList = structure.data || {};
  const references = structure.references || {};
  const nameLabel = Object.keys(references).join(', ') || 'Graph (Adjacency List)';

  const nodes = Object.keys(adjacencyList);
  const n = nodes.length;
  
  // Circular layout parameters
  const radius = 100 + (n * 5); // scale radius slightly with node count
  const centerX = radius + 40;
  const centerY = radius + 40;
  
  const getNodePosition = (index: number) => {
    const angle = (index / n) * 2 * Math.PI - Math.PI / 2; // start from top
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle)
    };
  };

  const nodePositions = nodes.reduce((acc: any, node, idx) => {
    acc[node] = getNodePosition(idx);
    return acc;
  }, {});

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full overflow-x-auto p-4">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {nameLabel}
      </div>
      <div className="relative" style={{ width: n === 0 ? 'auto' : centerX * 2, height: n === 0 ? 'auto' : centerY * 2 }}>
        {n === 0 ? (
           <div className="flex flex-col items-center py-8">
             <span className="text-muted font-mono text-xs font-bold px-4 py-2 bg-surface border border-border rounded">Empty Graph</span>
           </div>
        ) : (
          <>
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
              {nodes.map((node) => {
                const neighbors = adjacencyList[node]?.values || [];
                const pos1 = nodePositions[node];
                return neighbors.map((neighbor: any, i: number) => {
                   // Handle objects with values or primitive strings
                   const targetName = typeof neighbor === 'object' && neighbor !== null ? String(neighbor.value || neighbor.val || '') : String(neighbor);
                   const pos2 = nodePositions[targetName];
                   if (!pos1 || !pos2) return null;
                   return (
                     <line 
                       key={`${node}-${targetName}-${i}`}
                       x1={pos1.x} y1={pos1.y} x2={pos2.x} y2={pos2.y}
                       stroke="currentColor" 
                       strokeWidth="2" 
                       className="text-primary/40"
                     />
                   );
                });
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node];
              if (!pos) return null;
              return (
                <motion.div
                  key={node}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute w-12 h-12 bg-surface border-2 border-primary flex items-center justify-center rounded-full shadow-sm z-10 -ml-6 -mt-6"
                  style={{ left: pos.x, top: pos.y }}
                >
                  <span className="text-base font-bold text-text truncate px-1">
                     {node}
                  </span>
                </motion.div>
              )
            })}
          </>
        )}
      </div>
    </div>
  )
}
