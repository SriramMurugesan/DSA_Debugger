import { useExecutionStore } from '../../store/executionStore'

export function ConsoleOutput() {
  const { error, steps, currentStepIndex } = useExecutionStore()
  const currentStep = steps[currentStepIndex]

  return (
    <div className="w-full h-full flex flex-col min-w-0">
      <div className="px-4 py-1.5 border-b border-border/50 bg-background/50 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 shadow-sm flex items-center">
        <span className="w-1 h-3 bg-muted mr-2"></span> Console Output
      </div>
      <div className="flex-1 p-3 font-mono text-xs overflow-auto text-muted whitespace-pre-wrap scrollbar-thin">
        {error ? (
          <span className="text-error font-semibold">{error}</span>
        ) : currentStep?.stdout && currentStep.stdout.length > 0 ? (
          currentStep.stdout.join('\n')
        ) : (
          <span className="opacity-50">Ready to run...</span>
        )}
      </div>
    </div>
  )
}
