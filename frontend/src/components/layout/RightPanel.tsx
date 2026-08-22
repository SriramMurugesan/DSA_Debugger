import { VisualizationRouter } from '../visualizers/VisualizationRouter'
import { VariableInspector } from '../debugger/VariableInspector'
import { Maximize, ZoomIn, ZoomOut } from 'lucide-react'
import { useState, useRef } from 'react'

export function RightPanel() {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  
  const handleZoomIn = () => setZoom(z => Math.min(z + 0.25, 3));
  const handleZoomOut = () => setZoom(z => Math.max(z - 0.25, 0.25));

  const handleFitToView = () => {
    if (!containerRef.current || !contentRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const contentRect = contentRef.current.children[0]?.getBoundingClientRect();
    if (!contentRect) return;

    // Reset transform temporarily to measure intrinsic size if needed,
    // but we can also just divide current bounding rect by current zoom
    const contentWidth = contentRect.width / zoom;
    const contentHeight = contentRect.height / zoom;

    const scaleX = (containerRect.width - 64) / contentWidth;
    const scaleY = (containerRect.height - 64) / contentHeight;
    const newScale = Math.max(0.1, Math.min(scaleX, scaleY, 1));
    
    setZoom(newScale);
    setPan({ x: 0, y: 0 });
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY * -0.01;
      setZoom(z => Math.max(0.1, Math.min(z + delta, 3)));
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    // Only drag on the empty background, not on buttons/elements
    if (e.target === contentRef.current || e.target === containerRef.current) {
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPan(p => ({ x: p.x + e.movementX, y: p.y + e.movementY }));
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col w-full h-full bg-surface border-l border-border relative z-10 min-w-0">
      {/* Variables Panel */}
      <div className="flex-none max-h-[40%] border-b border-border flex flex-col bg-background/50 relative">
        <div className="px-4 py-1.5 border-b border-border/50 bg-surface/80 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 flex items-center shadow-sm">
          <span className="w-1 h-3 bg-primary mr-2"></span> Current State / Variables
        </div>
        <div className="overflow-y-auto p-4 scrollbar-thin">
          <VariableInspector />
        </div>
      </div>

      {/* Main Visualization Area - Bottom 60% */}
      <div className="flex-1 flex flex-col relative overflow-hidden bg-surface">
        <div className="px-4 py-1.5 bg-background/80 text-[10px] font-bold text-muted uppercase tracking-widest absolute top-0 w-full z-20 border-b border-border/50 flex items-center justify-between shadow-sm backdrop-blur-sm">
          <div className="flex items-center">
            <span className="w-1 h-3 bg-secondary mr-2"></span> Live Memory / Data Visualization
          </div>
          <div className="flex items-center space-x-1">
             <button onClick={handleZoomOut} className="p-1 hover:bg-border rounded text-muted hover:text-text transition-colors" title="Zoom Out"><ZoomOut size={14}/></button>
             <span className="text-[10px] font-mono px-1 w-10 text-center">{Math.round(zoom * 100)}%</span>
             <button onClick={handleZoomIn} className="p-1 hover:bg-border rounded text-muted hover:text-text transition-colors" title="Zoom In"><ZoomIn size={14}/></button>
             <button onClick={handleFitToView} className="p-1 hover:bg-border rounded text-muted hover:text-text ml-2 transition-colors" title="Fit to View"><Maximize size={12}/></button>
          </div>
        </div>
        <div 
          ref={containerRef}
          className={`flex-1 overflow-hidden p-8 pt-12 relative flex items-center justify-center ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <div 
            ref={contentRef}
            className="w-full h-full flex items-center justify-center origin-center transition-transform duration-75"
            style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
          >
             <VisualizationRouter />
          </div>
        </div>
      </div>
    </div>
  )
}
