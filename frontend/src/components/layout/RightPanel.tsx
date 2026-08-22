import { VisualizationRouter } from '../visualizers/VisualizationRouter'
import { VariableInspector } from '../debugger/VariableInspector'

export function RightPanel() {
  return (
    <div className="flex flex-col w-full h-full bg-surface border-l border-border relative z-10 min-w-0">
      {/* Variables Panel */}
      <div className="flex-none max-h-[40%] border-b border-border flex flex-col bg-background/50 relative">
        <div className="px-4 py-1.5 border-b border-border/50 bg-surface/80 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 flex items-center shadow-sm">
          <span className="w-1 h-3 bg-primary mr-2"></span> Current State / Variables
        </div>
        <div className="overflow-y-auto p-4 scrollbar-thin">
          <VariableInspector />
        </div>
      </div>

      {/* Main Visualization Area - Bottom 60% */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-surface">
        <div className="px-4 py-1.5 bg-background/80 text-[10px] font-bold text-muted uppercase tracking-widest absolute top-0 w-full z-20 border-b border-border/50 flex items-center justify-between shadow-sm backdrop-blur-sm">
          <div className="flex items-center">
            <span className="w-1 h-3 bg-secondary mr-2"></span> Live Memory / Data Visualization
          </div>
        </div>
        <div className="flex-1 overflow-hidden pt-8 relative flex items-center justify-center">
          <div className="w-full h-full flex items-center justify-center">
             <VisualizationRouter />
          </div>
        </div>
      </div>
    </div>
  )
}
