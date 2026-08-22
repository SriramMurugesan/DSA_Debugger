import { useExecutionStore } from '../../store/executionStore'

export function CallStack() {
  const { steps, currentStepIndex } = useExecutionStore();
  const currentStep = steps[currentStepIndex];

  if (!currentStep || !currentStep.call_stack || currentStep.call_stack.length === 0) {
    return <div className="text-muted italic">Not executing</div>;
  }

  return (
    <div className="flex flex-col space-y-1">
      {currentStep.call_stack.map((frame, index) => (
        <div 
          key={index} 
          className={`flex items-center space-x-2 px-2 py-1 rounded ${index === 0 ? 'bg-primary/10 text-primary' : 'text-muted'}`}
        >
          <span className="font-mono text-sm">{frame.function}()</span>
          {index === 0 && <span className="text-xs bg-primary/20 px-1.5 rounded">Active</span>}
        </div>
      ))}
    </div>
  );
}
