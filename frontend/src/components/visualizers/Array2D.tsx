import { motion } from 'framer-motion'

export function Array2DVisualizer({ name, data }: { name: string, data: any[][] }) {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {name} (DP / Matrix)
      </div>
      <div className="flex flex-col space-y-1">
        {data.length === 0 ? (
           <div className="text-muted font-mono text-xs font-bold px-4 py-2 bg-surface border border-border rounded">
             Empty Matrix
           </div>
        ) : (
          data.map((row, rowIdx) => (
            <div key={`row-${rowIdx}`} className="flex space-x-1">
              {row.map((val: any, colIdx: number) => (
                <motion.div
                  key={`${rowIdx}-${colIdx}`}
                  layout
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-10 h-10 shrink-0 bg-surface border border-primary/30 flex items-center justify-center rounded-sm shadow-sm"
                >
                  <span className="text-xs font-bold text-text truncate px-1">{typeof val === 'object' ? '...' : val}</span>
                </motion.div>
              ))}
            </div>
          ))
        )}
      </div>
    </div>
  )
}
