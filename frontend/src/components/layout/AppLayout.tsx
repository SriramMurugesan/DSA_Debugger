import { Header } from './Header'
import { LeftPanel } from './LeftPanel'
import { RightPanel } from './RightPanel'
import { CallStack } from '../debugger/CallStack'
import { ConsoleOutput } from '../debugger/ConsoleOutput'
import { useState, useRef } from 'react'

export interface AppLayoutProps {
  header?: React.ReactNode;
  topLeft?: React.ReactNode;
  topRight?: React.ReactNode;
  bottomLeft?: React.ReactNode;
  bottomRight?: React.ReactNode;
  hideHeader?: boolean;
}

export function AppLayout({ header, topLeft, topRight, bottomLeft, bottomRight, hideHeader = false }: AppLayoutProps) {
  // Panel sizing state
  const [leftWidth, setLeftWidth] = useState(50); // percentage
  const [bottomHeight, setBottomHeight] = useState(25); // percentage
  
  const workspaceRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const startHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'col-resize';
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!workspaceRef.current) return;
      const rect = workspaceRef.current.getBoundingClientRect();
      const newWidth = ((moveEvent.clientX - rect.left) / rect.width) * 100;
      if (newWidth > 20 && newWidth < 80) setLeftWidth(newWidth);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const startVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    document.body.style.cursor = 'row-resize';
    
    const onMouseMove = (moveEvent: MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const distanceFromBottom = rect.bottom - moveEvent.clientY;
      const newHeight = (distanceFromBottom / rect.height) * 100;
      if (newHeight > 10 && newHeight < 60) setBottomHeight(newHeight);
    };
    
    const onMouseUp = () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
      document.body.style.cursor = 'default';
    };
    
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  const DefaultBottomLeft = <ConsoleOutput />;

  const DefaultBottomRight = (
    <div className="w-full h-full flex flex-col min-w-0">
      <div className="px-4 py-1.5 border-b border-border/50 bg-background/50 text-[10px] font-bold text-muted uppercase tracking-widest shrink-0 shadow-sm flex items-center">
        <span className="w-1 h-3 bg-secondary mr-2"></span> Call Stack
      </div>
      <div className="flex-1 p-3 overflow-auto text-xs text-muted scrollbar-thin">
        <CallStack />
      </div>
    </div>
  );

  return (
    <div ref={containerRef} className="flex flex-col h-full w-full bg-background text-text overflow-hidden">
      {!hideHeader && (header || <Header />)}
      
      {/* Top Workspace (Left/Right) */}
      <div 
        ref={workspaceRef} 
        className="flex overflow-hidden min-h-0 relative flex-1"
        style={{ height: `${100 - bottomHeight}%` }}
      >
        <div style={{ width: `${leftWidth}%` }} className="h-full min-w-0">
          {topLeft || <LeftPanel />}
        </div>
        
        {/* Horizontal Resizer */}
        <div 
          onMouseDown={startHorizontalDrag}
          className="w-1 bg-border/50 hover:bg-primary cursor-col-resize z-50 flex-shrink-0 transition-colors"
        />
        
        <div style={{ width: `calc(${100 - leftWidth}% - 4px)` }} className="h-full min-w-0">
          {topRight || <RightPanel />}
        </div>
      </div>
      
      {/* Vertical Resizer */}
      <div 
        onMouseDown={startVerticalDrag}
        className="h-1 bg-border/50 hover:bg-primary cursor-row-resize z-50 flex-shrink-0 transition-colors"
      />
      
      {/* Bottom Panel */}
      <div 
        style={{ height: `calc(${bottomHeight}% - 4px)` }}
        className="flex bg-surface shrink-0 z-20 relative"
      >
        <div className="w-1/2 flex flex-col border-r border-border min-w-0">
          {bottomLeft || DefaultBottomLeft}
        </div>
        <div className="w-1/2 flex flex-col min-w-0">
          {bottomRight || DefaultBottomRight}
        </div>
      </div>
    </div>
  )
}
