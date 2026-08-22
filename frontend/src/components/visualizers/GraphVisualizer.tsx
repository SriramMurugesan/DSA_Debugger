import { motion } from 'framer-motion'
import { useState, useEffect, useMemo, useRef } from 'react'

export function GraphVisualizer({ structure, simpleVariables = {} }: { structure: any, simpleVariables?: Record<string, any> }) {
  const adjacencyList = structure.data || {};
  const references = structure.references || {};
  const nameLabel = Object.keys(references).join(', ') || 'Graph';

  const nodes = Object.keys(adjacencyList);
  const n = nodes.length;
  
  // Find variables pointing to nodes (e.g. vertex1 = "A")
  const nodeVariables: Record<string, string[]> = useMemo(() => {
    const map: Record<string, string[]> = {};
    Object.entries(simpleVariables).forEach(([varName, valueObj]) => {
      const val = typeof valueObj === 'object' && valueObj !== null ? String(valueObj.value || valueObj.val || '') : String(valueObj);
      if (nodes.includes(val)) {
        if (!map[val]) map[val] = [];
        map[val].push(varName);
      }
    });
    return map;
  }, [simpleVariables, nodes]);

  // Base configuration
  const canvasWidth = 800;
  const canvasHeight = 600;
  const centerX = canvasWidth / 2;
  const centerY = canvasHeight / 2;
  const NODE_RADIUS = 30; // 56px width/height ~ 28px + border
  
  // Compute edges first
  const edges = useMemo(() => {
    const edgeList: {source: string, target: string, id: string, isDirected: boolean}[] = [];
    const seenUndirected = new Set<string>();
    
    Object.keys(adjacencyList).forEach(source => {
      const neighbors = adjacencyList[source]?.values || adjacencyList[source] || [];
      if (Array.isArray(neighbors)) {
        neighbors.forEach(neighbor => {
          const target = typeof neighbor === 'object' && neighbor !== null ? String(neighbor.value || neighbor.val || '') : String(neighbor);
          
          if (!target) return;

          const targetNeighbors = adjacencyList[target]?.values || adjacencyList[target] || [];
          const hasReverse = Array.isArray(targetNeighbors) && targetNeighbors.some((n: any) => 
            (typeof n === 'object' && n !== null ? String(n.value || n.val || '') : String(n)) === source
          );

          if (hasReverse) {
            const canonicalId = [source, target].sort().join('-');
            if (!seenUndirected.has(canonicalId)) {
              seenUndirected.add(canonicalId);
              edgeList.push({ source, target, id: canonicalId, isDirected: false });
            }
          } else {
            edgeList.push({ source, target, id: `${source}->${target}`, isDirected: true });
          }
        });
      }
    });
    return edgeList;
  }, [adjacencyList]);

  // Stable positions state via Force-Directed Layout
  const [nodePositions, setNodePositions] = useState<Record<string, {x: number, y: number, vx: number, vy: number}>>({});
  
  useEffect(() => {
    setNodePositions(prev => {
      const next = { ...prev };
      const currentNodes = Object.keys(adjacencyList);
      
      if (currentNodes.length === 0) return next;
      
      // 1. Initialize new nodes
      currentNodes.forEach((node) => {
        if (!next[node]) {
          next[node] = {
            x: centerX + (Math.random() - 0.5) * 100,
            y: centerY + (Math.random() - 0.5) * 100,
            vx: 0,
            vy: 0
          };
        }
      });
      
      // 2. Synchronous Force Physics Simulation (Settle instantly)
      const REPULSION = 4000;
      const SPRING_LENGTH = 150;
      const SPRING_K = 0.08;
      const DAMPING = 0.7;
      const MIN_NODE_DISTANCE = 100;
      
      const activeNodes = Object.keys(next).filter(n => currentNodes.includes(n));
      
      for (let iter = 0; iter < 120; iter++) {
        const forces: Record<string, {fx: number, fy: number}> = {};
        activeNodes.forEach(n => forces[n] = {fx: 0, fy: 0});
        
        // Repulsion & Collision
        for (let i = 0; i < activeNodes.length; i++) {
          for (let j = i + 1; j < activeNodes.length; j++) {
            const n1 = activeNodes[i];
            const n2 = activeNodes[j];
            const p1 = next[n1];
            const p2 = next[n2];
            
            let dx = p1.x - p2.x;
            let dy = p1.y - p2.y;
            let distSq = dx*dx + dy*dy;
            if (distSq === 0) { dx = Math.random(); dy = Math.random(); distSq = dx*dx + dy*dy; }
            let dist = Math.sqrt(distSq);
            
            const force = REPULSION / distSq;
            let fx = (dx / dist) * force;
            let fy = (dy / dist) * force;
            
            if (dist < MIN_NODE_DISTANCE) {
               const pushForce = (MIN_NODE_DISTANCE - dist) * 0.5;
               fx += (dx / dist) * pushForce;
               fy += (dy / dist) * pushForce;
            }
            
            forces[n1].fx += fx;
            forces[n1].fy += fy;
            forces[n2].fx -= fx;
            forces[n2].fy -= fy;
          }
        }
        
        // Attraction (Edges)
        edges.forEach(edge => {
          if (!forces[edge.source] || !forces[edge.target]) return;
          const p1 = next[edge.source];
          const p2 = next[edge.target];
          
          let dx = p2.x - p1.x;
          let dy = p2.y - p1.y;
          let dist = Math.sqrt(dx*dx + dy*dy);
          if (dist === 0) dist = 0.01;
          
          const force = (dist - SPRING_LENGTH) * SPRING_K;
          const fx = (dx / dist) * force;
          const fy = (dy / dist) * force;
          
          forces[edge.source].fx += fx;
          forces[edge.source].fy += fy;
          forces[edge.target].fx -= fx;
          forces[edge.target].fy -= fy;
        });
        
        // Center Gravity (keep graph centered)
        activeNodes.forEach(n => {
          const p = next[n];
          forces[n].fx += (centerX - p.x) * 0.03;
          forces[n].fy += (centerY - p.y) * 0.03;
        });
        
        // Apply velocity & positions
        activeNodes.forEach(n => {
          const p = next[n];
          p.vx = (p.vx + forces[n].fx) * DAMPING;
          p.vy = (p.vy + forces[n].fy) * DAMPING;
          p.x += p.vx;
          p.y += p.vy;
        });
      }
      
      return next;
    });
  }, [adjacencyList, edges, centerX, centerY]);
  
  // Pan and Zoom state
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  // Mouse Handlers for Pan and Zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const zoomSensitivity = 0.002;
    const delta = -e.deltaY * zoomSensitivity;
    setScale(s => Math.min(Math.max(0.3, s + delta), 3));
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - position.x, y: e.clientY - position.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.current.x, y: e.clientY - dragStart.current.y });
    }
  };

  const handleMouseUp = () => setIsDragging(false);

  return (
    <div className="flex flex-col items-center w-full h-full min-h-0">
      <div className="text-primary font-mono text-sm font-semibold bg-primary/10 px-3 py-1 rounded-full border border-primary/20 mb-3 shrink-0 shadow-sm">
        {nameLabel}
      </div>
      
      {/* Viewport Toolbar */}
      <div className="w-full flex justify-end px-2 mb-2 shrink-0">
         <button 
           onClick={() => { setScale(1); setPosition({x:0, y:0}); }}
           className="text-xs bg-surface border border-border px-3 py-1 rounded font-bold text-muted hover:text-primary transition-colors"
         >
            Reset View
         </button>
      </div>

      <div 
        className="relative w-full flex-1 bg-surface/30 rounded-xl border border-border shadow-inner flex items-center justify-center overflow-hidden cursor-move min-h-0"
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {n === 0 ? (
           <div className="text-muted font-mono text-xs font-bold px-4 py-2 bg-surface border border-border rounded">Empty Graph</div>
        ) : (
          <div 
            className="relative" 
            style={{ 
              width: canvasWidth, 
              height: canvasHeight,
              transform: `translate(${position.x}px, ${position.y}px) scale(${scale})`,
              transformOrigin: 'center',
              transition: isDragging ? 'none' : 'transform 0.05s ease-out'
            }}
          >
            {/* Edges */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 overflow-visible">
              <defs>
                <marker id="arrowhead" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <polygon points="0 0, 8 3, 0 6" fill="currentColor" className="text-primary" />
                </marker>
              </defs>
              {edges.map((edge) => {
                const p1 = nodePositions[edge.source];
                const p2 = nodePositions[edge.target];
                if (!p1 || !p2) return null;
                
                // Calculate precise edge points clipping to node radius
                const dx = p2.x - p1.x;
                const dy = p2.y - p1.y;
                const dist = Math.sqrt(dx*dx + dy*dy);
                if (dist === 0) return null;
                
                const sourceX = p1.x + (dx/dist) * NODE_RADIUS;
                const sourceY = p1.y + (dy/dist) * NODE_RADIUS;
                const targetX = p2.x - (dx/dist) * NODE_RADIUS;
                const targetY = p2.y - (dy/dist) * NODE_RADIUS;

                return (
                  <line 
                    key={edge.id}
                    x1={sourceX} y1={sourceY} x2={targetX} y2={targetY}
                    stroke="currentColor" 
                    strokeWidth="3" 
                    className="text-primary/50 transition-all duration-300"
                    markerEnd={edge.isDirected ? "url(#arrowhead)" : ""}
                  />
                );
              })}
            </svg>

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = nodePositions[node];
              if (!pos) return null;
              
              const activeVars = nodeVariables[node] || [];
              const isActive = activeVars.length > 0;
              
              return (
                <motion.div
                  key={node}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                  className={`absolute w-14 h-14 bg-surface border-[3px] flex items-center justify-center rounded-full shadow-lg z-10 hover:scale-110 transition-transform cursor-pointer ${isActive ? 'border-secondary shadow-[0_0_15px_rgba(var(--color-secondary),0.4)]' : 'border-primary'}`}
                  style={{ left: pos.x - NODE_RADIUS, top: pos.y - NODE_RADIUS }}
                >
                  <span className={`text-lg font-bold truncate px-1 ${isActive ? 'text-secondary' : 'text-text'}`}>
                     {node}
                  </span>
                  
                  {/* Variable Badges */}
                  {isActive && (
                    <div className="absolute -top-7 flex flex-col items-center pointer-events-none whitespace-nowrap z-20">
                      {activeVars.map(v => (
                        <span key={v} className="bg-secondary/20 text-secondary border border-secondary/50 text-[10px] font-mono font-bold px-2 py-0.5 rounded-full mb-0.5 shadow-sm">
                          {v}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
