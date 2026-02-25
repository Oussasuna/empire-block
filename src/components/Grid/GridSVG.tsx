'use client';

import React, { useMemo, useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Maximize2, Minimize2, ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Territory } from '@/hooks/useGrid';

interface GridSVGProps {
    territories: Territory[];
    selectedCell: { x: number, y: number } | null;
    onCellClick: (x: number, y: number) => void;
}

export default function GridSVG({ territories, selectedCell, onCellClick }: GridSVGProps) {
    const gridSize = 50;
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const cellSize = 30; // Base cell size in pixels
    const totalSize = gridSize * cellSize;

    // Create a map of coordinates to territories
    const territoryMap = useMemo(() => {
        const map = new Map();
        territories.forEach(t => {
            map.set(`${t.x_coordinate},${t.y_coordinate}`, t);
        });
        return map;
    }, [territories]);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;
        setOffset({
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y
        });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    const handleZoom = (delta: number) => {
        setZoom(prev => Math.min(Math.max(prev + delta, 0.5), 3));
    };

    const resetView = () => {
        setZoom(1);
        setOffset({ x: 0, y: 0 });
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'corner': return '#FBBF24'; // Gold
            case 'capital': return '#EF4444'; // Red
            case 'border': return '#06B6D4'; // Cyan
            default: return '#7C3AED'; // Purple
        }
    };

    return (
        <div className="relative w-full h-full bg-[#050508] overflow-hidden cursor-grab active:cursor-grabbing border border-white/5 rounded-3xl"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            ref={containerRef}
        >
            {/* Grid Controls */}
            <div className="absolute top-6 left-6 z-30 flex flex-col gap-2">
                <button onClick={() => handleZoom(0.2)} className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-2xl">
                    <ZoomIn size={20} />
                </button>
                <button onClick={() => handleZoom(-0.2)} className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-2xl">
                    <ZoomOut size={20} />
                </button>
                <button onClick={resetView} className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl text-white hover:bg-white/10 transition-colors shadow-2xl">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* SVG Grid */}
            <div
                className="w-full h-full flex items-center justify-center transition-transform duration-75"
                style={{
                    transform: `translate(${offset.x}px, ${offset.y}px) scale(${zoom})`
                }}
            >
                <svg
                    width={totalSize}
                    height={totalSize}
                    viewBox={`0 0 ${totalSize} ${totalSize}`}
                    className="drop-shadow-[0_0_30px_rgba(124,58,237,0.1)]"
                >
                    {/* Background Grid Lines */}
                    {Array.from({ length: gridSize + 1 }).map((_, i) => (
                        <React.Fragment key={i}>
                            <line
                                x1={i * cellSize}
                                y1={0}
                                x2={i * cellSize}
                                y2={totalSize}
                                stroke="white"
                                strokeOpacity="0.03"
                                strokeWidth="1"
                            />
                            <line
                                x1={0}
                                y1={i * cellSize}
                                x2={totalSize}
                                y2={i * cellSize}
                                stroke="white"
                                strokeOpacity="0.03"
                                strokeWidth="1"
                            />
                        </React.Fragment>
                    ))}

                    {/* Territories */}
                    {territories.map((t) => {
                        const isSelected = selectedCell?.x === t.x_coordinate && selectedCell?.y === t.y_coordinate;
                        const color = getColor(t.block_type);

                        return (
                            <g
                                key={`${t.x_coordinate},${t.y_coordinate}`}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onCellClick(t.x_coordinate, t.y_coordinate);
                                }}
                                className="cursor-pointer group"
                            >
                                <rect
                                    x={t.x_coordinate * cellSize + 2}
                                    y={t.y_coordinate * cellSize + 2}
                                    width={cellSize - 4}
                                    height={cellSize - 4}
                                    fill={color}
                                    fillOpacity={isSelected ? 0.9 : 0.4}
                                    stroke={color}
                                    strokeWidth={isSelected ? 3 : 1}
                                    strokeOpacity={isSelected ? 1 : 0.6}
                                    rx="4"
                                    className="transition-all duration-300 group-hover:fill-opacity-80"
                                />
                                {isSelected && (
                                    <rect
                                        x={t.x_coordinate * cellSize - 2}
                                        y={t.y_coordinate * cellSize - 2}
                                        width={cellSize + 4}
                                        height={cellSize + 4}
                                        fill="none"
                                        stroke={color}
                                        strokeWidth="2"
                                        strokeOpacity="0.3"
                                        rx="6"
                                        className="animate-pulse"
                                    />
                                )}
                            </g>
                        );
                    })}

                    {/* Hover indicator layer (optional, can be added for all cells) */}
                </svg>
            </div>

            {/* Legend Overlay */}
            <div className="absolute bottom-6 left-6 z-30 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex flex-wrap gap-4 shadow-2xl">
                <LegendItem color="#7C3AED" label="Standard" />
                <LegendItem color="#06B6D4" label="Border" />
                <LegendItem color="#EF4444" label="Capital" />
                <LegendItem color="#FBBF24" label="Corner" />
            </div>
        </div>
    );
}

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full shadow-[0_0_10px_currentColor]" style={{ backgroundColor: color, color }} />
        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{label}</span>
    </div>
);
