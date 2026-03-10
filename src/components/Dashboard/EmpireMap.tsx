'use client';

import { useMemo } from 'react';

interface EmpireMapProps {
  territories: any[];
  empires: any[];
}

export default function EmpireMap({ territories, empires }: EmpireMapProps) {
  const gridSize = 50;
  const cellSize = 24; // pixels - increased for better visibility

  // Create a map of coordinates to territories
  const territoryMap = useMemo(() => {
    const map = new Map();
    territories.forEach(t => {
      map.set(`${t.x_coordinate},${t.y_coordinate}`, t);
    });
    return map;
  }, [territories]);

  // Find bounding box
  const bounds = useMemo(() => {
    if (territories.length === 0) return { minX: 0, maxX: 0, minY: 0, maxY: 0 };

    let minX = gridSize, maxX = 0, minY = gridSize, maxY = 0;
    territories.forEach(t => {
      minX = Math.min(minX, t.x_coordinate);
      maxX = Math.max(maxX, t.x_coordinate);
      minY = Math.min(minY, t.y_coordinate);
      maxY = Math.max(maxY, t.y_coordinate);
    });

    // Add padding (at least 3 cells around the limits)
    return {
      minX: Math.max(0, minX - 3),
      maxX: Math.min(gridSize - 1, maxX + 3),
      minY: Math.max(0, minY - 3),
      maxY: Math.min(gridSize - 1, maxY + 3),
    };
  }, [territories]);

  const numCols = bounds.maxX - bounds.minX + 1;
  const numRows = bounds.maxY - bounds.minY + 1;
  const width = numCols * cellSize;
  const height = numRows * cellSize;

  const getColor = (type: string) => {
    switch (type) {
      case 'corner': return { stroke: '#FBBF24', fill: 'rgba(251, 191, 36, 0.2)' }; // Gold
      case 'capital': return { stroke: '#EF4444', fill: 'rgba(239, 68, 68, 0.2)' }; // Red
      case 'border': return { stroke: '#06B6D4', fill: 'rgba(6, 182, 212, 0.2)' }; // Cyan
      default: return { stroke: '#A855F7', fill: 'rgba(168, 85, 247, 0.2)' }; // Purple
    }
  };

  return (
    <div className="relative w-full">
      <div className="overflow-auto rounded-2xl bg-black/50 border border-white/10 flex justify-center items-center min-h-[350px] relative custom-scrollbar shadow-inner">
        {/* Radar sweeping effect background layered behind the SVG */}
        {territories.length > 0 && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />
        )}

        {territories.length > 0 ? (
          <div className="relative m-4">
            <svg
              width={width}
              height={height}
              className="relative drop-shadow-2xl"
            >
              <defs>
                <pattern id="gridPattern" width={cellSize} height={cellSize} patternUnits="userSpaceOnUse">
                  <path d={`M ${cellSize} 0 L 0 0 0 ${cellSize}`} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                  {/* Plus sign at intersection */}
                  <path d="M -2 0 L 2 0 M 0 -2 L 0 2" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                </pattern>
                {/* Glow filter */}
                <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur" />
                  <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Base Grid */}
              <rect width={width} height={height} fill="url(#gridPattern)" />

              {/* Axes / Grid Labels (Every 5 units) */}
              {Array.from({ length: numCols + 1 }).map((_, i) => {
                const actualX = bounds.minX + i;
                if (actualX % 5 === 0) {
                  return (
                    <text key={`lx-${actualX}`} x={i * cellSize + 2} y={12} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
                      {actualX}
                    </text>
                  );
                }
                return null;
              })}
              {Array.from({ length: numRows + 1 }).map((_, i) => {
                const actualY = bounds.minY + i;
                if (actualY % 5 === 0 && actualY !== 0) {
                  return (
                    <text key={`ly-${actualY}`} x={2} y={i * cellSize - 2} fill="rgba(255,255,255,0.3)" fontSize="8" fontFamily="monospace">
                      {actualY}
                    </text>
                  );
                }
                return null;
              })}

              {/* Territories */}
              {Array.from({ length: numRows }).map((_, y) =>
                Array.from({ length: numCols }).map((_, x) => {
                  const actualX = bounds.minX + x;
                  const actualY = bounds.minY + y;
                  const territory = territoryMap.get(`${actualX},${actualY}`);

                  if (!territory) return null;

                  const colors = getColor(territory.block_type);

                  return (
                    <g key={`${actualX},${actualY}`} className="cursor-pointer group transition-all duration-300">
                      {/* Outer targeting reticle */}
                      <rect
                        x={x * cellSize + 2}
                        y={y * cellSize + 2}
                        width={cellSize - 4}
                        height={cellSize - 4}
                        fill={colors.fill}
                        stroke={colors.stroke}
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                        className="opacity-70 group-hover:opacity-100 group-hover:stroke-[2] transition-all"
                      />
                      {/* Inner solid fill core */}
                      <rect
                        x={x * cellSize + 6}
                        y={y * cellSize + 6}
                        width={cellSize - 12}
                        height={cellSize - 12}
                        fill={colors.stroke}
                        filter="url(#neonGlow)"
                        className="opacity-90 group-hover:opacity-100 group-hover:scale-110 origin-center transition-all"
                        style={{ transformOrigin: `${x * cellSize + cellSize / 2}px ${y * cellSize + cellSize / 2}px` }}
                      />

                      <title>
                        Target: [{actualX}, {actualY}]&#10;Type: {territory.block_type.toUpperCase()}
                      </title>
                    </g>
                  );
                })
              )}
            </svg>
          </div>
        ) : (
          <div className="flex flex-col items-center text-gray-500 opacity-50">
            <svg className="w-16 h-16 mb-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
            <div className="text-sm tracking-widest uppercase font-bold">Grid Sector Empty</div>
            <div className="text-xs mt-1">Acquire territory to initialize scan</div>
          </div>
        )}
      </div>

      {/* Tactical Legend */}
      <div className="mt-4 flex flex-wrap gap-4 justify-center bg-black/30 py-3 px-6 rounded-xl border border-white/5">
        {[
          { label: 'Standard', color: '#A855F7', bg: 'bg-purple-500' },
          { label: 'Border', color: '#06B6D4', bg: 'bg-cyan-500' },
          { label: 'Corner', color: '#FBBF24', bg: 'bg-amber-500' },
          { label: 'Capital', color: '#EF4444', bg: 'bg-rose-500' }
        ].map(item => (
          <div key={item.label} className="flex items-center gap-2 group cursor-default">
            <div className={`w-3 h-3 rounded-[3px] border border-white/20 relative overflow-hidden`}>
              <div className={`absolute inset-0 ${item.bg} opacity-20`} />
              <div className={`absolute inset-1 ${item.bg} rounded-[2px] shadow-[0_0_8px_${item.color}]`} />
            </div>
            <span className="text-[10px] text-gray-400 group-hover:text-gray-200 uppercase tracking-widest font-bold transition-colors">
              {item.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
