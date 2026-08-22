import { Play, Pause, StepForward, StepBack, RotateCcw, Loader2, Undo2 } from 'lucide-react'
import { useExecutionStore } from '../../store/executionStore'
import { useExecutionPlayback } from '../../hooks/useExecutionPlayback'

export function Header() {
  useExecutionPlayback();
  const { executeCode, clearExecution, status, steps, currentStepIndex, play, pause, nextStep, previousStep, reset } = useExecutionStore();
  const isExecuting = status === 'executing';
  const isPlaying = status === 'playing';
  const hasSteps = steps.length > 0;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= steps.length - 1;

  return (
    <header className="flex items-center justify-between px-4 h-12 border-b border-border bg-surface shrink-0 z-50 shadow-sm">
      {/* Branding */}
      <div className="flex items-center space-x-3 w-1/4">
        <img src="/logo.png" alt="MagizhCode" className="h-6 w-6 object-contain" />
        <span className="text-sm font-extrabold text-text tracking-tight hidden sm:block">
          Magizh<span className="text-primary">Code</span>
        </span>
        <span className="text-[10px] font-bold px-2 py-0.5 bg-primary/10 border border-primary/20 rounded text-primary uppercase tracking-wider">Python</span>
      </div>

      {/* Playback Controls */}
      <div className="flex items-center justify-center space-x-1 w-2/4">
        <button
          onClick={reset} disabled={!hasSteps || isAtStart}
          className="p-1.5 hover:bg-elevated rounded text-muted hover:text-text disabled:opacity-30 transition-colors"
          title="Reset to Start"
        >
          <Undo2 size={15} />
        </button>
        <button
          onClick={previousStep} disabled={!hasSteps || isAtStart || isPlaying}
          className="p-1.5 hover:bg-elevated rounded text-muted hover:text-text disabled:opacity-30 transition-colors"
          title="Previous Step"
        >
          <StepBack size={17} />
        </button>

        {isPlaying ? (
          <button
            onClick={pause}
            className="p-1.5 bg-primary/20 text-primary hover:bg-primary/30 rounded transition-colors shadow-sm"
            title="Pause"
          >
            <Pause size={17} fill="currentColor" />
          </button>
        ) : (
          <button
            onClick={play} disabled={!hasSteps || isAtEnd}
            className="p-1.5 bg-primary/10 text-primary hover:bg-primary/20 rounded transition-colors disabled:opacity-30 shadow-sm"
            title="Play"
          >
            <Play size={17} fill="currentColor" />
          </button>
        )}

        <button
          onClick={nextStep} disabled={!hasSteps || isAtEnd || isPlaying}
          className="p-1.5 hover:bg-elevated rounded text-muted hover:text-text disabled:opacity-30 transition-colors"
          title="Next Step"
        >
          <StepForward size={17} />
        </button>

        {hasSteps && (
          <div className="ml-3 px-2 py-0.5 bg-elevated border border-border rounded text-[10px] font-mono text-muted whitespace-nowrap">
            Step {currentStepIndex + 1} / {steps.length}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-2 w-1/4">
        <button
          onClick={clearExecution}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-elevated border border-border text-muted hover:text-text hover:border-border-active transition-all shadow-sm"
        >
          <RotateCcw size={13} />
          <span>Reset</span>
        </button>
        <button
          onClick={() => executeCode('run')} disabled={isExecuting}
          className="flex items-center space-x-1 px-3 py-1.5 text-xs font-bold rounded-lg bg-elevated border border-border text-text hover:border-border-active transition-all shadow-sm disabled:opacity-50"
        >
          {isExecuting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} />}
          <span>Run</span>
        </button>
        <button
          onClick={() => executeCode('visualize')} disabled={isExecuting}
          className="flex items-center space-x-1 px-4 py-1.5 text-xs font-bold rounded-lg bg-primary text-background hover:bg-primary-light transition-all shadow-md shadow-primary/20 disabled:opacity-50"
        >
          {isExecuting ? <Loader2 size={13} className="animate-spin" /> : <Play size={13} fill="currentColor" />}
          <span>Visualize</span>
        </button>
      </div>
    </header>
  )
}
