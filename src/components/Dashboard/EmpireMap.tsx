'use client';

import { useMemo } from 'react';

interface EmpireMapProps {
  territories: any[];
  empires: any[];
}

export default function EmpireMap({ territories, empires }: EmpireMapProps) {
  const gridSize = 50;
  const cellSize = 8; // pixels

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

    // Add padding
    return {
      minX: Math.max(0, minX - 2),
      maxX: Math.min(gridSize - 1, maxX + 2),
      minY: Math.max(0, minY - 2),
      maxY: Math.min(gridSize - 1, maxY + 2),
    };
  }, [territories]);

  const width = (bounds.maxX - bounds.minX + 1) * cellSize;
  const height = (bounds.maxY - bounds.minY + 1) * cellSize;

  const getColor = (type: string) => {
    switch (type) {
      case 'corner': return '#FBBF24'; // Gold
      case 'capital': return '#EF4444'; // Red
      case 'border': return '#06B6D4'; // Cyan
      default: return '#9CA3AF'; // Gray
    }
  };

  return (
    <div className="relative">
      <div className="overflow-auto rounded-lg p-4 bg-black/20 border border-white/5 flex justify-center items-center h-[300px]">
        {territories.length > 0 ? (
          <svg
            width={width}
            height={height}
            className="max-h-full"
            style={{ minWidth: width > 300 ? '100%' : 'auto' }}
          >
            {/* Grid lines */}
            {Array.from({ length: bounds.maxX - bounds.minX + 2 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * cellSize}
                y1={0}
                x2={i * cellSize}
                y2={height}
                stroke="#ffffff"
                strokeOpacity="0.05"
                strokeWidth="0.5"
              />
            ))}
            {Array.from({ length: bounds.maxY - bounds.minY + 2 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * cellSize}
                x2={width}
                y2={i * cellSize}
                stroke="#ffffff"
                strokeOpacity="0.05"
                strokeWidth="0.5"
              />
            ))}

            {/* Territories */}
            {Array.from({ length: bounds.maxY - bounds.minY + 1 }).map((_, y) =>
              Array.from({ length: bounds.maxX - bounds.minX + 1 }).map((_, x) => {
                const actualX = bounds.minX + x;
                const actualY = bounds.minY + y;
                const territory = territoryMap.get(`${actualX},${actualY}`);

                if (!territory) return null;

                return (
                  <g key={`${actualX},${actualY}`}>
                    <rect
                      x={x * cellSize}
                      y={y * cellSize}
                      width={cellSize}
                      height={cellSize}
                      fill={getColor(territory.block_type)}
                      stroke="#000"
                      strokeWidth="0.5"
                      className="transition-opacity duration-200 hover:opacity-80 cursor-pointer"
                    />
                    <title>
                      pos: ({actualX}, {actualY})&#10;type: {territory.block_type}
                    </title>
                  </g>
                );
              })
            )}
          </svg>
        ) : (
          <div className="text-gray-500 text-sm">No territories owned yet</div>
        )}
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-3 justify-center">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#9CA3AF]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Standard</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#06B6D4]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Border</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-[#EF4444]"></div>
          <span className="text-[10px] text-gray-400 uppercase tracking-wider">Capital</span>
        </div>
      </div>
    </div>
  );
}
