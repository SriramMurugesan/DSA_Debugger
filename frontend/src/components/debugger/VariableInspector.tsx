import { useExecutionStore } from '../../store/executionStore'
import { motion, AnimatePresence } from 'framer-motion'

export function VariableInspector() {
  const { steps, currentStepIndex } = useExecutionStore();
  const currentStep = steps[currentStepIndex];
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;

  if (!currentStep || !currentStep.variables || Object.keys(currentStep.variables).length === 0) {
    return <div className="text-muted italic p-2 text-sm">No variables to show</div>;
  }

  const getTypeLabel = (val: any) => {
    if (val === null) return 'NULL';
    if (typeof val === 'number') return 'NUM';
    if (typeof val === 'string') return 'STR';
    if (typeof val === 'boolean') return 'BOOL';
    if (Array.isArray(val)) return 'ARR';
    if (typeof val === 'object') return 'OBJ';
    return 'VAR';
  };

  const renderValue = (val: any): string => {
    if (val === null) return 'None';
    if (typeof val === 'string') return `"${val}"`;
    if (Array.isArray(val)) return `[${val.length} items]`;
    if (typeof val === 'object') return '{...}';
    return String(val);
  };

  // Pre-calculate status and sort
  const variableEntries = Object.entries(currentStep.variables).map(([key, value]) => {
    let isChanged = false;
    let isNew = false;
    if (previousStep && previousStep.variables) {
      if (!(key in previousStep.variables)) {
        isNew = true;
      } else {
        const prevVal = previousStep.variables[key];
        isChanged = JSON.stringify(prevVal) !== JSON.stringify(value);
      }
    } else if (currentStepIndex === 0) {
      isNew = true; // Everything is new on step 0
    }
    return { key, value, isChanged, isNew };
  });

  // Sort: changed/new first, then alphabetically
  variableEntries.sort((a, b) => {
    const aPriority = a.isChanged || a.isNew;
    const bPriority = b.isChanged || b.isNew;
    if (aPriority && !bPriority) return -1;
    if (!aPriority && bPriority) return 1;
    return a.key.localeCompare(b.key);
  });

  return (
    <div className="grid gap-2" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gridAutoRows: 'max-content' }}>
      <AnimatePresence>
        {variableEntries.map(({ key, value, isChanged, isNew }) => (
          <motion.div 
            key={key} 
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-surface border p-2 rounded-lg flex flex-col shadow-sm transition-colors relative overflow-hidden ${isChanged ? 'border-primary bg-primary/10' : isNew && currentStepIndex > 0 ? 'border-success/50 bg-success/10' : 'border-border/60'}`}
          >
            {/* Highlight Indicator */}
            {(isChanged || (isNew && currentStepIndex > 0)) && (
              <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full m-1.5 ${isChanged ? 'bg-primary animate-pulse' : 'bg-success'}`} />
            )}

            <div className="flex items-center space-x-1 border-b border-border/40 pb-1 mb-1">
              <span className="text-[9px] text-primary font-bold bg-primary/10 px-1 py-0.5 rounded uppercase tracking-wider">
                {getTypeLabel(value)}
              </span>
              <span className="font-bold text-xs text-text truncate" title={key}>{key}</span>
            </div>
            <div className={`text-sm font-bold truncate ${isChanged ? 'text-primary' : isNew && currentStepIndex > 0 ? 'text-success' : 'text-text'}`} title={String(renderValue(value))}>
              {renderValue(value)}
            </div>
            {isChanged && <span className="text-[8px] text-primary absolute bottom-1 right-1 uppercase font-bold">Changed</span>}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
