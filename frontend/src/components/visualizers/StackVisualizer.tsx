import { motion, AnimatePresence } from 'framer-motion'

export function StackVisualizer({ name, data }: { name: string, data: any[] }) {
  // Reverse the data so the top of the stack (last element) is physically at the top of the container
  const displayData = [...data].reverse();

  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {name} (Stack)
      </div>
      {/* The Container - U Shape */}
      <div className="relative w-40 min-h-[200px] border-b-4 border-l-4 border-r-4 border-primary/60 rounded-b-xl flex flex-col justify-end p-2 pb-4 bg-surface/30 shadow-inner overflow-hidden">
        <div className="flex flex-col justify-end space-y-2 w-full h-full min-h-full">
          <AnimatePresence mode="popLayout">
            {displayData.map((val: any, idx: number) => {
              const originalIndex = data.length - 1 - idx;
              return (
                <motion.div
                  key={`${originalIndex}-${val}`}
                  layout
                  initial={{ opacity: 0, y: -50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, x: 50, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  className="w-full h-12 shrink-0 bg-primary/20 border-2 border-primary flex items-center justify-center rounded shadow-sm relative z-10"
                >
                  <span className="text-base font-bold text-text truncate px-1">
                    {typeof val === 'object' ? '{...}' : val}
                  </span>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
