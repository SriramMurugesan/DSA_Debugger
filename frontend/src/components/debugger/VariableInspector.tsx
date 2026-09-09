import { useExecutionStore } from '../../store/executionStore'
import { motion, AnimatePresence } from 'framer-motion'
import { Sparkles, ArrowRight } from 'lucide-react'

export function VariableInspector() {
  const { steps, currentStepIndex } = useExecutionStore();
  const currentStep = steps[currentStepIndex];
  const previousStep = currentStepIndex > 0 ? steps[currentStepIndex - 1] : null;

  if (!currentStep || !currentStep.variables || Object.keys(currentStep.variables).length === 0) {
    return (
      <div className="flex items-center justify-center py-6 text-muted/60 italic text-xs font-mono">
        No active variables in current scope
      </div>
    );
  }

  const getTypeInfo = (val: any) => {
    if (val === null) return { label: 'None', bg: 'bg-zinc-800 text-zinc-400 border-zinc-700' };
    if (typeof val === 'number') {
      const isInt = Number.isInteger(val);
      return { 
        label: isInt ? 'int' : 'float', 
        bg: 'bg-amber-500/15 text-amber-300 border-amber-500/30' 
      };
    }
    if (typeof val === 'string') return { label: 'str', bg: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30' };
    if (typeof val === 'boolean') return { label: 'bool', bg: 'bg-purple-500/15 text-purple-300 border-purple-500/30' };
    if (Array.isArray(val)) return { label: `list[${val.length}]`, bg: 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30' };
    if (typeof val === 'object') return { label: 'dict', bg: 'bg-blue-500/15 text-blue-300 border-blue-500/30' };
    return { label: typeof val, bg: 'bg-primary/10 text-primary border-primary/20' };
  };

  const formatValue = (val: any): { display: string; colorClass: string } => {
    if (val === null) return { display: 'None', colorClass: 'text-zinc-400 italic' };
    if (typeof val === 'number') return { display: String(val), colorClass: 'text-amber-300 font-semibold' };
    if (typeof val === 'string') return { display: `"${val}"`, colorClass: 'text-emerald-300 font-medium' };
    if (typeof val === 'boolean') return { display: val ? 'True' : 'False', colorClass: 'text-purple-300 font-bold' };
    if (Array.isArray(val)) {
      if (val.length <= 4) {
        return { display: `[${val.join(', ')}]`, colorClass: 'text-cyan-300' };
      }
      return { display: `[${val.slice(0, 3).join(', ')}, ... +${val.length - 3}]`, colorClass: 'text-cyan-300' };
    }
    if (typeof val === 'object') return { display: '{...}', colorClass: 'text-blue-300' };
    return { display: String(val), colorClass: 'text-text' };
  };

  // Filter out objects that are visualized in the main visualizer pane
  const variableEntries = Object.entries(currentStep.variables)
    .filter(([_, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        return false;
      }
      return true;
    })
    .map(([key, value]) => {
      let isChanged = false;
      let isNew = false;
      let prevValDisplay: string | null = null;

      if (previousStep && previousStep.variables) {
        if (!(key in previousStep.variables)) {
          isNew = true;
        } else {
          const prevVal = previousStep.variables[key];
          isChanged = JSON.stringify(prevVal) !== JSON.stringify(value);
          if (isChanged) {
            prevValDisplay = formatValue(prevVal).display;
          }
        }
      } else if (currentStepIndex === 0) {
        isNew = true;
      }

      return { key, value, isChanged, isNew, prevValDisplay };
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
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between px-1 pb-1 text-[10px] text-muted font-mono uppercase tracking-wider">
        <span>{variableEntries.length} {variableEntries.length === 1 ? 'variable' : 'variables'} tracked</span>
        <span className="text-[9px] text-muted/60">Step {currentStepIndex + 1}</span>
      </div>

      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence>
          {variableEntries.map(({ key, value, isChanged, isNew, prevValDisplay }) => {
            const typeInfo = getTypeInfo(value);
            const valInfo = formatValue(value);

            return (
              <motion.div
                key={key}
                layout
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className={`group rounded-lg px-3 py-2 border text-xs font-mono transition-all relative overflow-hidden flex flex-col justify-between ${
                  isChanged
                    ? 'bg-amber-500/10 border-amber-400/70 shadow-[0_0_12px_rgba(242,197,92,0.15)]'
                    : isNew && currentStepIndex > 0
                    ? 'bg-emerald-500/10 border-emerald-400/50 shadow-[0_0_12px_rgba(52,211,153,0.12)]'
                    : 'bg-[#121214] hover:bg-[#161619] border-border/70 hover:border-border-active'
                }`}
              >
                {/* Header: Name & Type */}
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/70 shrink-0" />
                    <span className="font-bold text-text truncate text-xs group-hover:text-primary transition-colors" title={key}>
                      {key}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={`text-[9px] px-1.5 py-0.2 rounded border font-semibold tracking-wider ${typeInfo.bg}`}>
                      {typeInfo.label}
                    </span>
                    {isChanged && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-amber-400 text-black flex items-center gap-0.5 animate-pulse">
                        <Sparkles size={9} /> UPD
                      </span>
                    )}
                    {isNew && currentStepIndex > 0 && (
                      <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-emerald-400 text-black">
                        NEW
                      </span>
                    )}
                  </div>
                </div>

                {/* Value Section */}
                <div className="flex items-baseline justify-between pt-0.5 border-t border-border/30">
                  {prevValDisplay ? (
                    <div className="flex items-center gap-1 text-[11px] truncate" title={`${prevValDisplay} → ${valInfo.display}`}>
                      <span className="text-muted/60 line-through truncate max-w-[50px]">{prevValDisplay}</span>
                      <ArrowRight size={10} className="text-amber-400 shrink-0" />
                      <span className={`${valInfo.colorClass} truncate font-bold`}>{valInfo.display}</span>
                    </div>
                  ) : (
                    <span className={`text-[13px] truncate ${valInfo.colorClass}`} title={valInfo.display}>
                      {valInfo.display}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
