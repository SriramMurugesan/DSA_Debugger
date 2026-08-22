import { motion } from 'framer-motion'

export function HashMapVisualizer({ name, data }: { name: string, data: any }) {
  const isDict = data.__type__ === 'dict';
  const typeLabel = isDict ? 'Dictionary / Map' : (data.__type__ || 'Object');
  const label = name ? `${name} (${typeLabel})` : typeLabel;

  const entriesToRender = isDict ? data.values || {} : data;
  const entries = Object.entries(entriesToRender).filter(([k]) => !k.startsWith('__'));
  
  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center space-y-4 mb-8">
        <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
          {label}
        </div>
        <div className="text-muted font-mono text-xs font-bold px-4 py-2 bg-surface border border-border rounded">
          {isDict ? 'Empty Dictionary' : 'Empty Object'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center space-y-4 mb-8">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20">
        {label}
      </div>
      <div className="flex flex-wrap gap-3 justify-center max-w-xl">
        {entries.map(([key, val]) => {
          let valStr = String(val);
          if (Array.isArray(val)) {
            valStr = `[${val.length} items]`;
          } else if (typeof val === 'object' && val !== null) {
            valStr = '{...}';
          }

          return (
            <motion.div
              key={key}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-2 bg-surface border border-border p-2 rounded shadow-sm"
            >
              <span className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">{key}</span>
              <span className="text-muted text-xs">→</span>
              <span className="text-sm font-bold text-text truncate max-w-[120px]" title={valStr}>
                {valStr}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  )
}
