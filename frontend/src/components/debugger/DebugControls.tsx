import { StepForward, StepBack, Play, Pause, RotateCcw } from 'lucide-react';
import { useExecutionStore } from '../../store/executionStore';
import { useExecutionPlayback } from '../../hooks/useExecutionPlayback';

export function DebugControls() {
  // Initialize playback loop
  useExecutionPlayback();

  const { 
    status, steps, currentStepIndex, 
    play, pause, nextStep, previousStep, reset 
  } = useExecutionStore();

  const isPlaying = status === 'playing';
  const hasSteps = steps.length > 0;
  const isAtStart = currentStepIndex === 0;
  const isAtEnd = currentStepIndex >= steps.length - 1;

  return (
    <div className="h-14 border-b border-border flex items-center justify-center space-x-2 bg-surface/50">
      <button 
        onClick={reset}
        disabled={!hasSteps || isAtStart}
        className="p-2 hover:bg-border rounded text-muted hover:text-text disabled:opacity-50"
        title="Reset"
      >
        <RotateCcw size={18} />
      </button>
      <button 
        onClick={previousStep}
        disabled={!hasSteps || isAtStart || isPlaying}
        className="p-2 hover:bg-border rounded text-muted hover:text-text disabled:opacity-50"
        title="Previous Step"
      >
        <StepBack size={18} />
      </button>
      
      {isPlaying ? (
        <button 
          onClick={pause}
          className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors"
          title="Pause"
        >
          <Pause size={20} fill="currentColor" />
        </button>
      ) : (
        <button 
          onClick={play}
          disabled={!hasSteps || isAtEnd}
          className="p-2 bg-primary/20 text-primary hover:bg-primary/30 rounded-full transition-colors disabled:opacity-50"
          title="Play"
        >
          <Play size={20} fill="currentColor" />
        </button>
      )}

      <button 
        onClick={nextStep}
        disabled={!hasSteps || isAtEnd || isPlaying}
        className="p-2 hover:bg-border rounded text-muted hover:text-text disabled:opacity-50"
        title="Next Step"
      >
        <StepForward size={18} />
      </button>
      <div className="ml-4 px-3 py-1 bg-border rounded text-xs font-mono text-muted min-w-[80px] text-center">
        Step: {hasSteps ? currentStepIndex + 1 : 0} / {steps.length}
      </div>
    </div>
  );
}
