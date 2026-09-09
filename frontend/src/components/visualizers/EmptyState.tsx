import { LayoutGrid, AlertCircle, Sparkles } from 'lucide-react'
import { useExecutionStore } from '../../store/executionStore'

export function EmptyState() {
  const { code, steps, setCode, executeCode, testCallSnippet } = useExecutionStore();

  // Check if user has defined a function without invoking it
  const funcMatch = code.match(/def\s+([a-zA-Z0-9_]+)\s*\(([^)]*)\)/);
  const funcName = funcMatch ? funcMatch[1] : null;

  // Check if the function is called elsewhere in the code
  const isFunctionCalled = funcName
    ? new RegExp(`(?<!def\\s+)${funcName}\\s*\\(`).test(code)
    : true;

  const handleAppendAndRun = async () => {
    let callSnippet = testCallSnippet;
    if (!callSnippet && funcName) {
      callSnippet = `\n\n# --- Call to Visualize ---\nresult = ${funcName}([1, 12, -5, -6, 50, 3], 4)\nprint("Result:", result)\n`;
    }
    if (callSnippet) {
      const updatedCode = code.trimEnd() + callSnippet;
      setCode(updatedCode);
      setTimeout(() => {
        executeCode('visualize');
      }, 50);
    }
  };

  if (steps.length > 0 && funcName && !isFunctionCalled) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-6 bg-surface/95 border border-amber-500/30 rounded-2xl space-y-4 max-w-md shadow-2xl backdrop-blur-md mx-4 animate-fadeIn">
        <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-amber-400">
          <AlertCircle size={32} />
        </div>
        <div>
          <h3 className="text-base font-bold text-text mb-1">
            Function <span className="text-amber-400 font-mono">"{funcName}"</span> Not Called
          </h3>
          <p className="text-xs text-muted leading-relaxed">
            Python only executes lines inside a function when the function is called with arguments. Add a call at the bottom of the editor to visualize memory & variables!
          </p>
        </div>

        <div className="w-full bg-background/90 border border-border rounded-lg p-3 text-left font-mono text-xs text-text/80 shadow-inner overflow-x-auto">
          <div className="text-[10px] text-muted font-bold uppercase tracking-wider mb-1">Call snippet:</div>
          <pre className="text-primary font-bold text-[11px] whitespace-pre-wrap">
            {testCallSnippet ? testCallSnippet.trim() : `print(${funcName}(...))`}
          </pre>
        </div>

        <button
          onClick={handleAppendAndRun}
          className="w-full py-2.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
        >
          <Sparkles size={14} />
          <span>Append Call & Visualize Step-by-Step</span>
        </button>
      </div>
    );
  }

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
