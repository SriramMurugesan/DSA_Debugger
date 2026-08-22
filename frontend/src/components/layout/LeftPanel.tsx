import { CodeEditor } from '../editor/CodeEditor'

export function LeftPanel() {
  return (
    <div className="flex flex-col h-full min-w-0 relative z-10 w-full">
      <div className="px-4 py-1.5 border-b border-border/50 bg-background/50 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 flex items-center shadow-sm">
        <span className="w-1 h-3 bg-primary/80 mr-2"></span> Editor
      </div>
      <div className="flex-1 relative min-h-0">
        <CodeEditor />
      </div>
    </div>
  )
}
