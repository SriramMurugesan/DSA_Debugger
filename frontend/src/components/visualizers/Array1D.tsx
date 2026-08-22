import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { createPortal } from 'react-dom'
import { Settings, X } from 'lucide-react'

interface Pointer {
  name: string;
  value: any;
}

type Mode = 'default' | 'iteration' | 'twopointer' | 'slidingwindow' | 'binarysearch';

export function Array1DVisualizer({ name, data, pointers = [] }: { name: string, data: any[], pointers?: Pointer[] }) {
  const [showOptions, setShowOptions] = useState(false);
  const [mode, setMode] = useState<Mode>('default');
  const [bindings, setBindings] = useState<Record<string, string>>({});

  const pointerNames = pointers.map(p => p.name);

  // Helper to get role color
  const getRoleColor = (role: string) => {
    switch (role) {
      case 'left':
      case 'low':
      case 'start': return 'bg-green-500 text-white';
      case 'right':
      case 'high':
      case 'end': return 'bg-blue-500 text-white';
      case 'mid': return 'bg-yellow-500 text-black';
      default: return 'bg-secondary text-white';
    }
  };

  const getBorderColor = (role: string) => {
    switch (role) {
      case 'left':
      case 'low':
      case 'start': return 'border-green-500';
      case 'right':
      case 'high':
      case 'end': return 'border-blue-500';
      case 'mid': return 'border-yellow-500';
      default: return 'border-secondary';
    }
  };

  const updateBinding = (role: string, ptrName: string) => {
    setBindings(prev => ({ ...prev, [role]: ptrName }));
  };

  // Extract window bounds if sliding window
  let windowStart = -1;
  let windowEnd = -1;
  if (mode === 'slidingwindow') {
    const startP = pointers.find(p => p.name === bindings['start']);
    const endP = pointers.find(p => p.name === bindings['end']);
    if (startP && typeof startP.value === 'number') windowStart = startP.value;
    if (endP && typeof endP.value === 'number') windowEnd = endP.value;
    if (windowStart > windowEnd && windowStart !== -1 && windowEnd !== -1) {
      const temp = windowStart;
      windowStart = windowEnd;
      windowEnd = temp;
    }
  }

  return (
    <div className="flex flex-col items-center space-y-4 mb-8 w-full max-w-full relative">
      <div className="flex items-center justify-between w-full px-8">
        <div className="flex flex-col">
           <div className="text-primary font-mono text-sm font-semibold">Variable: {name}</div>
           {mode !== 'default' && (
             <div className="text-secondary font-bold text-[10px] tracking-widest uppercase mt-1 flex items-center">
               <span className="w-1 h-3 bg-error mr-2"></span> {mode}
             </div>
           )}
        </div>
        <button 
          onClick={() => setShowOptions(true)}
          className="flex items-center space-x-1 px-3 py-1 bg-surface border border-border/60 hover:border-primary/50 rounded-md text-xs font-semibold text-muted hover:text-text transition-colors"
        >
          <Settings size={14} />
          <span>OPTIONS</span>
        </button>
      </div>

      <div className="flex justify-center w-full pb-8 pt-12 px-4 md:px-8">
        <div className="grid grid-flow-col auto-cols-fr gap-2 md:gap-4 w-full max-w-5xl">
        {data.map((val: any, idx: number) => {
          // Find all pointers for this cell
          let cellPointers = pointers.filter(p => p.value === idx);
          
          // Determine cell styles based on mode
          let isWindowed = false;
          let cellBorder = "border-primary/50";
          let cellBg = "bg-surface";

          if (mode === 'slidingwindow' && windowStart !== -1 && windowEnd !== -1) {
            if (idx >= windowStart && idx <= windowEnd) {
              isWindowed = true;
              cellBg = "bg-primary/20";
              cellBorder = "border-primary";
            }
          }

          if (mode !== 'default') {
             for (const [role, pName] of Object.entries(bindings)) {
               if (pointers.find(p => p.name === pName)?.value === idx) {
                 cellBorder = getBorderColor(role);
               }
             }
          }

          return (
            <div key={`${idx}`} className="relative flex flex-col items-center">
              {/* Pointers above cell */}
              {cellPointers.length > 0 && (
                <div className="absolute bottom-full mb-2 flex flex-col-reverse items-center gap-1 z-20">
                  {cellPointers.map(p => {
                    let role = 'default';
                    if (mode !== 'default') {
                      const foundRole = Object.keys(bindings).find(r => bindings[r] === p.name);
                      if (foundRole) role = foundRole;
                    }
                    
                    const badgeColor = getRoleColor(role);

                    return (
                      <div key={p.name} className="flex flex-col items-center">
                        <span className={`text-[10px] sm:text-xs font-mono font-bold px-1.5 sm:px-2 py-0.5 rounded shadow-sm ${badgeColor}`}>
                          {p.name}
                        </span>
                        <div className={`w-0.5 h-1.5 sm:h-2 ${badgeColor.split(' ')[0]}`} />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* The Cell */}
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.8, y: -20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                className={`aspect-square w-full min-w-[40px] max-w-[120px] border-2 flex flex-col items-center justify-center shadow-sm relative z-10 transition-colors ${cellBg} ${cellBorder} ${isWindowed ? 'rounded-md' : 'rounded'}`}
              >
                <span className="text-lg sm:text-2xl font-bold text-text truncate max-w-full px-1">
                  {typeof val === 'object' ? '{...}' : val}
                </span>
                <span className="absolute -bottom-5 sm:-bottom-6 text-[9px] sm:text-[11px] text-muted font-mono font-bold">{idx}</span>
              </motion.div>
            </div>
          )
        })}
        </div>
      </div>

      {/* Settings Modal */}
      {typeof document !== 'undefined' && createPortal(
        <AnimatePresence>
          {showOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm"
              onClick={(e) => {
                 if (e.target === e.currentTarget) setShowOptions(false);
              }}
            >
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col relative z-[101]"
              >
                <div className="flex justify-between items-center p-4 border-b border-border/50 bg-background/50">
                  <div>
                    <h3 className="text-sm font-bold text-text">Visualization Mode</h3>
                    <p className="text-xs text-muted">Configure how this array is rendered</p>
                  </div>
                  <button onClick={() => setShowOptions(false)} className="text-muted hover:text-error transition-colors p-1">
                    <X size={18} />
                  </button>
                </div>
                
                <div className="p-4 space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'default', label: 'Default', desc: 'Standard array' },
                      { id: 'iteration', label: 'Iteration', desc: 'Loop traversal' },
                      { id: 'twopointer', label: 'Two Pointers', desc: 'Left/right technique' },
                      { id: 'slidingwindow', label: 'Sliding Window', desc: 'Window with bounds' },
                      { id: 'binarysearch', label: 'Binary Search', desc: 'Low, mid, high' }
                    ].map(m => (
                      <button
                        key={m.id}
                        onClick={() => setMode(m.id as Mode)}
                        className={`text-left p-3 rounded-lg border flex flex-col space-y-1 transition-all ${mode === m.id ? 'border-error bg-error/10' : 'border-border/60 bg-background hover:border-primary/50'}`}
                      >
                        <span className={`text-sm font-bold ${mode === m.id ? 'text-error' : 'text-text'}`}>{m.label}</span>
                        <span className="text-[10px] text-muted">{m.desc}</span>
                      </button>
                    ))}
                  </div>

                  {mode !== 'default' && (
                    <div className="space-y-4">
                      <div className="text-xs font-bold text-error tracking-widest uppercase border-b border-border/50 pb-2">
                        {mode} — Variable Binding
                      </div>
                      <div className="space-y-3">
                        {mode === 'iteration' && (
                           <BindingSelect role="iterator" label="Iterator" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                        )}
                        {mode === 'twopointer' && (
                          <>
                            <BindingSelect role="left" label="Left pointer" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                            <BindingSelect role="right" label="Right pointer" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                          </>
                        )}
                        {mode === 'slidingwindow' && (
                          <>
                            <BindingSelect role="start" label="Window Start" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                            <BindingSelect role="end" label="Window End" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                          </>
                        )}
                        {mode === 'binarysearch' && (
                          <>
                            <BindingSelect role="low" label="Low index" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                            <BindingSelect role="mid" label="Mid index" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                            <BindingSelect role="high" label="High index" pointers={pointerNames} bindings={bindings} updateBinding={updateBinding} />
                          </>
                        )}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="p-4 border-t border-border/50 bg-background/50">
                  <button 
                    onClick={() => setShowOptions(false)}
                    className="w-full py-2 bg-error hover:bg-error/90 text-white font-bold rounded-lg transition-colors shadow-md"
                  >
                    APPLY
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </div>
  )
}

function BindingSelect({ role, label, pointers, bindings, updateBinding }: { role: string, label: string, pointers: string[], bindings: Record<string, string>, updateBinding: (role: string, val: string) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs font-semibold text-text">{label}</span>
      <select 
        value={bindings[role] || ''}
        onChange={(e) => updateBinding(role, e.target.value)}
        className="bg-background border border-border/60 rounded px-2 py-1 text-xs text-primary font-mono outline-none focus:border-primary w-32"
      >
        <option value="">-- Select --</option>
        {pointers.map(p => <option key={p} value={p}>{p}</option>)}
      </select>
    </div>
  );
}
