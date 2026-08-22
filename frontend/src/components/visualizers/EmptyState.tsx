import { LayoutGrid } from 'lucide-react'

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center text-muted space-y-4 max-w-sm">
      <div className="p-4 bg-border/50 rounded-full">
        <LayoutGrid size={48} className="text-primary/70" />
      </div>
      <h3 className="text-lg font-semibold text-text">No Active Visualization</h3>
      <p className="text-sm">
        Write your Python code in the editor and click "Run / Visualize" to see how data structures and algorithms execute step by step.
      </p>
    </div>
  )
}
