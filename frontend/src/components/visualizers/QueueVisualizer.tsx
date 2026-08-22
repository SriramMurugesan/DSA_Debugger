import { motion, AnimatePresence } from 'framer-motion'

export function QueueVisualizer({ name, data }: { name: string, data: any[] }) {
  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {name} (Queue/Deque)
      </div>
      <div className="flex items-center space-x-2">
        <div className="text-muted font-mono text-xs">FRONT</div>
        {/* The Container - Horizontal Open Ends */}
        <div className="relative min-w-[200px] h-20 border-t-4 border-b-4 border-primary/60 flex items-center p-2 bg-surface/30 shadow-inner overflow-x-auto gap-2">
          <AnimatePresence mode="popLayout">
            {data.map((val: any, idx: number) => (
              <motion.div
                key={`${idx}-${val}`}
                layout
                initial={{ opacity: 0, x: 50, scale: 0.9 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.5 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
                className="w-12 h-12 shrink-0 bg-primary/20 border-2 border-primary flex items-center justify-center rounded shadow-sm relative z-10"
              >
                <span className="text-base font-bold text-text truncate px-1">
                  {typeof val === 'object' ? '{...}' : val}
                </span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
        <div className="text-muted font-mono text-xs">REAR</div>
      </div>
    </div>
  )
}
