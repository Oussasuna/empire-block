'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { ZoomIn, ZoomOut, RefreshCw } from 'lucide-react';
import { Territory } from '@/hooks/useGrid';
import './Grid2D.css';

/* ═══════════════════════════════════════════════
   Grid2D — High-Performance 2D Top-Down Grid
   Uses HTML Canvas for virtualized tile rendering
   ═══════════════════════════════════════════════ */

interface Grid2DProps {
    territories: Territory[];
    selectedCell: { x: number; y: number } | null;
    onCellClick: (x: number, y: number) => void;
    userWallet?: string | null;
}

// ── Tile color config ──
const TILE_COLORS: Record<string, { bg: string; border: string }> = {
    standard: { bg: '#1a1a2e', border: '#2a2a4e' },
    border:   { bg: '#1a1a3e', border: '#4444ff' },
    capital:  { bg: '#2a1a3e', border: '#9945FF' },
    corner:   { bg: '#3a2a1e', border: '#FFD93D' },
};
const OWNED_BORDER = '#14F195';
const SELECTED_GLOW = '#8b5cf6';
const HOVER_GLOW = 'rgba(139, 92, 246, 0.6)';
const GRID_SIZE = 50;
const BASE_CELL = 40; // px per cell at zoom 1
const MIN_ZOOM = 0.15;
const MAX_ZOOM = 4;
const ZOOM_SPEED = 0.001;
const TOTAL_GRID = GRID_SIZE * BASE_CELL; // 2000px

// ── Detect mobile ──
function isMobile() {
    if (typeof window === 'undefined') return false;
    return window.innerWidth <= 768 || 'ontouchstart' in window;
}

export default function Grid2D({ territories, selectedCell, onCellClick, userWallet }: Grid2DProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const rafRef = useRef<number>(0);
    const initializedRef = useRef(false);

    // ── Camera state ──
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [hoveredCell, setHoveredCell] = useState<{ x: number; y: number } | null>(null);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [containerSize, setContainerSize] = useState({ w: 0, h: 0 });

    // Drag state (refs for perf — no re-render during drag)
    const isDragging = useRef(false);
    const dragStart = useRef({ x: 0, y: 0 });
    const dragStartOffset = useRef({ x: 0, y: 0 });
    const hasDragged = useRef(false);
    const offsetRef = useRef({ x: 0, y: 0 });
    const zoomRef = useRef(1);
    const lastPinchDist = useRef(0);
    const lastPinchCenter = useRef({ x: 0, y: 0 });
    const mobile = useRef(false);

    // Sync refs
    useEffect(() => { offsetRef.current = offset; }, [offset]);
    useEffect(() => { zoomRef.current = zoom; }, [zoom]);

    // ── Territory lookup map ──
    const territoryMap = useMemo(() => {
        const map = new Map<string, Territory>();
        territories.forEach(t => {
            map.set(`${t.x_coordinate},${t.y_coordinate}`, t);
        });
        return map;
    }, [territories]);

    // ── Clamp offset so grid stays in view ──
    const clampOffset = useCallback((ox: number, oy: number, z: number) => {
        const container = containerRef.current;
        if (!container) return { x: ox, y: oy };
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        const gridPx = TOTAL_GRID * z;

        // Ensure at least 20% of the grid is always visible
        const margin = 0.2;
        const minX = cw - gridPx - cw * margin;
        const maxX = cw * margin;
        const minY = ch - gridPx - ch * margin;
        const maxY = ch * margin;

        return {
            x: Math.max(minX, Math.min(maxX, ox)),
            y: Math.max(minY, Math.min(maxY, oy)),
        };
    }, []);

    // ── Convert screen coords → grid coords ──
    const screenToGrid = useCallback((sx: number, sy: number) => {
        const canvas = canvasRef.current;
        if (!canvas) return null;
        const rect = canvas.getBoundingClientRect();
        const cx = (sx - rect.left - offsetRef.current.x) / zoomRef.current;
        const cy = (sy - rect.top - offsetRef.current.y) / zoomRef.current;
        const gx = Math.floor(cx / BASE_CELL);
        const gy = Math.floor(cy / BASE_CELL);
        if (gx >= 0 && gx < GRID_SIZE && gy >= 0 && gy < GRID_SIZE) return { x: gx, y: gy };
        return null;
    }, []);

    // ── Draw ──
    const draw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;

        if (w === 0 || h === 0) return; // Not laid out yet

        // Resize canvas for crisp rendering
        if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
            canvas.width = w * dpr;
            canvas.height = h * dpr;
        }
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Clear
        ctx.fillStyle = '#050510';
        ctx.fillRect(0, 0, w, h);

        // Draw subtle star-like dots in bg
        ctx.fillStyle = 'rgba(255,255,255,0.03)';
        for (let i = 0; i < 60; i++) {
            const sx2 = ((i * 137.5) % w);
            const sy2 = ((i * 221.3) % h);
            ctx.beginPath();
            ctx.arc(sx2, sy2, 1, 0, Math.PI * 2);
            ctx.fill();
        }

        const z = zoomRef.current;
        const ox = offsetRef.current.x;
        const oy = offsetRef.current.y;
        const cellPx = BASE_CELL * z;
        const isMobileDevice = mobile.current;

        // Determine visible tile range
        const startCol = Math.max(0, Math.floor(-ox / cellPx));
        const startRow = Math.max(0, Math.floor(-oy / cellPx));
        const endCol = Math.min(GRID_SIZE - 1, Math.floor((w - ox) / cellPx));
        const endRow = Math.min(GRID_SIZE - 1, Math.floor((h - oy) / cellPx));

        const gap = Math.max(1, Math.round(2 * z));
        const radius = Math.max(1, Math.round(3 * z));

        // Draw visible tiles
        for (let row = startRow; row <= endRow; row++) {
            for (let col = startCol; col <= endCol; col++) {
                const px = col * cellPx + ox;
                const py = row * cellPx + oy;
                const tileW = cellPx - gap;
                const tileH = cellPx - gap;

                const territory = territoryMap.get(`${col},${row}`);
                const type = territory?.block_type || 'standard';
                const colors = TILE_COLORS[type] || TILE_COLORS.standard;
                const isOwned = territory?.owner_wallet != null;
                const isUserOwned = isOwned && userWallet && territory?.owner_wallet === userWallet;
                const isFrozen = (territory as any)?.is_frozen;
                const isSelected = selectedCell?.x === col && selectedCell?.y === row;
                const isHovered = !isMobileDevice && hoveredCell?.x === col && hoveredCell?.y === row;

                ctx.save();

                // Frozen: reduce opacity
                if (isFrozen) ctx.globalAlpha = 0.4;

                // ── Fill ──
                ctx.beginPath();
                roundRect(ctx, px + gap / 2, py + gap / 2, tileW, tileH, radius);
                ctx.fillStyle = colors.bg;
                ctx.fill();

                // ── Border ──
                if (isSelected) {
                    ctx.strokeStyle = SELECTED_GLOW;
                    ctx.lineWidth = Math.max(2, 3 * z);
                    if (!isMobileDevice) {
                        ctx.shadowColor = SELECTED_GLOW;
                        ctx.shadowBlur = 12 * z;
                    }
                } else if (isHovered) {
                    ctx.strokeStyle = HOVER_GLOW;
                    ctx.lineWidth = Math.max(1.5, 2.5 * z);
                    if (!isMobileDevice) {
                        ctx.shadowColor = HOVER_GLOW;
                        ctx.shadowBlur = 8 * z;
                    }
                } else if (isUserOwned) {
                    ctx.strokeStyle = OWNED_BORDER;
                    ctx.lineWidth = Math.max(1.5, 2 * z);
                    if (!isMobileDevice) {
                        ctx.shadowColor = OWNED_BORDER;
                        ctx.shadowBlur = 4 * z;
                    }
                } else {
                    ctx.strokeStyle = colors.border;
                    ctx.lineWidth = Math.max(0.5, 1 * z);
                }
                ctx.stroke();

                ctx.shadowBlur = 0;
                ctx.shadowColor = 'transparent';

                // ── Level badge (if zoomed in enough) ──
                if (z >= 1.2 && (territory as any)?.level && (territory as any).level > 0) {
                    const lvl = (territory as any).level;
                    const badgeSize = 14 * z;
                    ctx.fillStyle = 'rgba(0,0,0,0.6)';
                    ctx.beginPath();
                    roundRect(ctx, px + tileW - badgeSize - 2 * z, py + gap / 2 + 2 * z, badgeSize, badgeSize, 3 * z);
                    ctx.fill();
                    ctx.fillStyle = '#FFD93D';
                    ctx.font = `bold ${Math.round(9 * z)}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText(`${lvl}`, px + tileW - badgeSize / 2 - 2 * z, py + gap / 2 + badgeSize / 2 + 2 * z);
                }

                // ── Frozen icon ──
                if (isFrozen && z >= 0.8) {
                    ctx.globalAlpha = 0.8;
                    ctx.font = `${Math.round(14 * z)}px sans-serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('❄️', px + tileW / 2, py + tileH / 2);
                }

                // ── Owner indicator (colored dot) ──
                if (isOwned && z >= 0.7) {
                    const dotR = Math.max(2, 4 * z);
                    ctx.beginPath();
                    ctx.arc(px + gap / 2 + dotR + 3 * z, py + gap / 2 + dotR + 3 * z, dotR, 0, Math.PI * 2);
                    ctx.fillStyle = isUserOwned ? OWNED_BORDER : '#ef4444';
                    ctx.fill();
                }

                ctx.restore();
            }
        }

        // ── Grid lines (very subtle) ──
        if (z >= 0.4) {
            ctx.strokeStyle = 'rgba(255,255,255,0.025)';
            ctx.lineWidth = 0.5;
            for (let col = startCol; col <= endCol + 1; col++) {
                const x = col * cellPx + ox;
                ctx.beginPath();
                ctx.moveTo(x, Math.max(0, startRow * cellPx + oy));
                ctx.lineTo(x, Math.min(h, (endRow + 1) * cellPx + oy));
                ctx.stroke();
            }
            for (let row = startRow; row <= endRow + 1; row++) {
                const y = row * cellPx + oy;
                ctx.beginPath();
                ctx.moveTo(Math.max(0, startCol * cellPx + ox), y);
                ctx.lineTo(Math.min(w, (endCol + 1) * cellPx + ox), y);
                ctx.stroke();
            }
        }
    }, [territoryMap, selectedCell, hoveredCell, userWallet]);

    // ── Animation loop ──
    useEffect(() => {
        const loop = () => {
            draw();
            rafRef.current = requestAnimationFrame(loop);
        };
        rafRef.current = requestAnimationFrame(loop);
        return () => cancelAnimationFrame(rafRef.current);
    }, [draw]);

    // ── Fit-to-view helper ──
    const fitToView = useCallback(() => {
        const container = containerRef.current;
        if (!container) return;
        const cw = container.clientWidth;
        const ch = container.clientHeight;
        if (cw === 0 || ch === 0) return;

        // Calculate zoom to fit entire grid, with some padding
        const padding = mobile.current ? 0.85 : 0.9;
        const fitZoom = Math.min(
            (cw * padding) / TOTAL_GRID,
            (ch * padding) / TOTAL_GRID
        );
        const z = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, fitZoom));
        const gridPx = TOTAL_GRID * z;

        const newOff = {
            x: (cw - gridPx) / 2,
            y: (ch - gridPx) / 2,
        };

        zoomRef.current = z;
        offsetRef.current = newOff;
        setZoom(z);
        setOffset(newOff);
    }, []);

    // ── Initialize: observe container resize, detect mobile, fit to view ──
    useEffect(() => {
        mobile.current = isMobile();

        const container = containerRef.current;
        if (!container) return;

        const observer = new ResizeObserver((entries) => {
            for (const entry of entries) {
                const { width, height } = entry.contentRect;
                setContainerSize({ w: width, h: height });

                // Auto-fit on first meaningful size
                if (!initializedRef.current && width > 0 && height > 0) {
                    initializedRef.current = true;
                    // Defer to next frame so canvas has dimensions
                    requestAnimationFrame(() => fitToView());
                }
            }
        });

        observer.observe(container);
        return () => observer.disconnect();
    }, [fitToView]);

    // ── Re-detect mobile on resize ──
    useEffect(() => {
        const handleResize = () => { mobile.current = isMobile(); };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // ── Apply offset with clamping ──
    const applyOffset = useCallback((ox: number, oy: number, z?: number) => {
        const clamped = clampOffset(ox, oy, z ?? zoomRef.current);
        offsetRef.current = clamped;
        setOffset(clamped);
    }, [clampOffset]);

    // ── Mouse handlers ──
    const handleMouseDown = useCallback((e: React.MouseEvent) => {
        isDragging.current = true;
        hasDragged.current = false;
        dragStart.current = { x: e.clientX, y: e.clientY };
        dragStartOffset.current = { ...offsetRef.current };
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        // Update hover
        const cell = screenToGrid(e.clientX, e.clientY);
        setHoveredCell(cell);
        setTooltipPos({ x: e.clientX, y: e.clientY });

        if (!isDragging.current) return;

        const dx = e.clientX - dragStart.current.x;
        const dy = e.clientY - dragStart.current.y;

        if (Math.abs(dx) > 3 || Math.abs(dy) > 3) {
            hasDragged.current = true;
        }

        applyOffset(
            dragStartOffset.current.x + dx,
            dragStartOffset.current.y + dy,
        );
    }, [screenToGrid, applyOffset]);

    const handleMouseUp = useCallback((e: React.MouseEvent) => {
        if (!hasDragged.current) {
            const cell = screenToGrid(e.clientX, e.clientY);
            if (cell) onCellClick(cell.x, cell.y);
        }
        isDragging.current = false;
        hasDragged.current = false;
    }, [screenToGrid, onCellClick]);

    const handleMouseLeave = useCallback(() => {
        isDragging.current = false;
        hasDragged.current = false;
        setHoveredCell(null);
    }, []);

    // ── Wheel zoom ──
    const handleWheel = useCallback((e: React.WheelEvent) => {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;

        const oldZoom = zoomRef.current;
        const delta = -e.deltaY * ZOOM_SPEED;
        const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, oldZoom + delta * oldZoom));

        // Zoom toward cursor
        const scale = newZoom / oldZoom;
        const newOff = {
            x: mx - (mx - offsetRef.current.x) * scale,
            y: my - (my - offsetRef.current.y) * scale,
        };

        zoomRef.current = newZoom;
        setZoom(newZoom);
        applyOffset(newOff.x, newOff.y, newZoom);
    }, [applyOffset]);

    // ── Touch handlers ──
    const handleTouchStart = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1) {
            isDragging.current = true;
            hasDragged.current = false;
            dragStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            dragStartOffset.current = { ...offsetRef.current };
        } else if (e.touches.length === 2) {
            isDragging.current = false;
            hasDragged.current = true; // Prevent tap-click during pinch
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            lastPinchDist.current = Math.hypot(dx, dy);
            lastPinchCenter.current = {
                x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
                y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
            };
        }
    }, []);

    const handleTouchMove = useCallback((e: React.TouchEvent) => {
        e.preventDefault();
        if (e.touches.length === 1 && isDragging.current) {
            const dx = e.touches[0].clientX - dragStart.current.x;
            const dy = e.touches[0].clientY - dragStart.current.y;

            if (Math.abs(dx) > 5 || Math.abs(dy) > 5) {
                hasDragged.current = true;
            }

            applyOffset(
                dragStartOffset.current.x + dx,
                dragStartOffset.current.y + dy,
            );
        } else if (e.touches.length === 2) {
            const dx = e.touches[0].clientX - e.touches[1].clientX;
            const dy = e.touches[0].clientY - e.touches[1].clientY;
            const dist = Math.hypot(dx, dy);

            if (lastPinchDist.current > 0) {
                const scale = dist / lastPinchDist.current;
                const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
                const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
                const canvas = canvasRef.current;
                if (canvas) {
                    const rect = canvas.getBoundingClientRect();
                    const mx = midX - rect.left;
                    const my = midY - rect.top;
                    const newZoom = Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, zoomRef.current * scale));
                    const s = newZoom / zoomRef.current;
                    const newOff = {
                        x: mx - (mx - offsetRef.current.x) * s,
                        y: my - (my - offsetRef.current.y) * s,
                    };
                    zoomRef.current = newZoom;
                    setZoom(newZoom);
                    applyOffset(newOff.x, newOff.y, newZoom);
                }
            }
            lastPinchDist.current = dist;
        }
    }, [applyOffset]);

    const handleTouchEnd = useCallback((e: React.TouchEvent) => {
        if (e.touches.length === 0) {
            // Tap = click (only if we didn't drag)
            if (!hasDragged.current && e.changedTouches.length === 1) {
                const t = e.changedTouches[0];
                const cell = screenToGrid(t.clientX, t.clientY);
                if (cell) onCellClick(cell.x, cell.y);
            }
            isDragging.current = false;
            hasDragged.current = false;
            lastPinchDist.current = 0;
        } else if (e.touches.length === 1) {
            // Went from 2-finger pinch to 1-finger: restart drag from current pos
            isDragging.current = true;
            hasDragged.current = true; // Don't trigger click
            dragStart.current = {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY,
            };
            dragStartOffset.current = { ...offsetRef.current };
            lastPinchDist.current = 0;
        }
    }, [screenToGrid, onCellClick]);

    // ── Zoom controls ──
    const zoomToCenter = useCallback((newZoom: number) => {
        const container = containerRef.current;
        if (!container) return;
        const midX = container.clientWidth / 2;
        const midY = container.clientHeight / 2;
        const scale = newZoom / zoomRef.current;
        const newOff = {
            x: midX - (midX - offsetRef.current.x) * scale,
            y: midY - (midY - offsetRef.current.y) * scale,
        };
        zoomRef.current = newZoom;
        setZoom(newZoom);
        applyOffset(newOff.x, newOff.y, newZoom);
    }, [applyOffset]);

    const handleZoomIn = useCallback(() => {
        zoomToCenter(Math.min(MAX_ZOOM, zoomRef.current * 1.3));
    }, [zoomToCenter]);

    const handleZoomOut = useCallback(() => {
        zoomToCenter(Math.max(MIN_ZOOM, zoomRef.current / 1.3));
    }, [zoomToCenter]);

    const handleReset = useCallback(() => {
        fitToView();
    }, [fitToView]);

    // Jump to specific grid location (used by minimap)
    const jumpTo = useCallback((gx: number, gy: number) => {
        const container = containerRef.current;
        if (!container) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        const cellPx = BASE_CELL * zoomRef.current;
        const newOff = {
            x: w / 2 - gx * cellPx - cellPx / 2,
            y: h / 2 - gy * cellPx - cellPx / 2,
        };
        applyOffset(newOff.x, newOff.y);
    }, [applyOffset]);

    // Hovered territory info
    const hoveredTerritory = hoveredCell ? territoryMap.get(`${hoveredCell.x},${hoveredCell.y}`) : null;

    return (
        <div className="grid2d-container" ref={containerRef}>
            <canvas
                ref={canvasRef}
                className="grid2d-canvas"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseLeave}
                onWheel={handleWheel}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
            />

            {/* Zoom Controls */}
            <div className="grid2d-controls">
                <button onClick={handleZoomIn} title="Zoom In">
                    <ZoomIn size={20} />
                </button>
                <button onClick={handleZoomOut} title="Zoom Out">
                    <ZoomOut size={20} />
                </button>
                <button onClick={handleReset} title="Reset View">
                    <RefreshCw size={20} />
                </button>
            </div>

            {/* Coordinate Tooltip (desktop only) */}
            {hoveredCell && !mobile.current && (
                <div
                    className="grid2d-tooltip"
                    style={{
                        left: tooltipPos.x + 16,
                        top: tooltipPos.y - 40,
                    }}
                >
                    ({hoveredCell.x}, {hoveredCell.y})
                    {hoveredTerritory && (
                        <div className="tooltip-type">{hoveredTerritory.block_type}</div>
                    )}
                </div>
            )}

            {/* Legend */}
            <div className="grid2d-legend">
                <LegendItem color="#7C3AED" label="Standard" />
                <LegendItem color="#4444ff" label="Border" />
                <LegendItem color="#9945FF" label="Capital" />
                <LegendItem color="#FFD93D" label="Corner" />
                <LegendItem color="#14F195" label="Owned" />
            </div>

            {/* Controls Hint (desktop only) */}
            <div className="grid2d-hint">
                <span>Drag to pan</span>
                <div className="hint-separator" />
                <span>Scroll to zoom</span>
                <div className="hint-separator" />
                <span>Click to select</span>
            </div>

            {/* Mini-Map (hidden on mobile) */}
            <MiniMap
                territories={territories}
                userWallet={userWallet}
                zoom={zoom}
                offset={offset}
                containerRef={containerRef}
                onJump={jumpTo}
            />
        </div>
    );
}

// ── Mini Map Component ──
interface MiniMapProps {
    territories: Territory[];
    userWallet?: string | null;
    zoom: number;
    offset: { x: number; y: number };
    containerRef: React.RefObject<HTMLDivElement | null>;
    onJump: (gx: number, gy: number) => void;
}

function MiniMap({ territories, userWallet, zoom, offset, containerRef, onJump }: MiniMapProps) {
    const miniRef = useRef<HTMLCanvasElement>(null);
    const MINI_SIZE = 130;
    const MINI_CELL = MINI_SIZE / GRID_SIZE;

    useEffect(() => {
        const canvas = miniRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const dpr = window.devicePixelRatio || 1;
        canvas.width = MINI_SIZE * dpr;
        canvas.height = MINI_SIZE * dpr;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Background
        ctx.fillStyle = 'rgba(5, 5, 16, 0.9)';
        ctx.fillRect(0, 0, MINI_SIZE, MINI_SIZE);

        // Draw tiles
        territories.forEach(t => {
            const type = t.block_type;
            const isUserOwned = t.owner_wallet && t.owner_wallet === userWallet;
            if (isUserOwned) {
                ctx.fillStyle = OWNED_BORDER;
            } else if (t.owner_wallet) {
                ctx.fillStyle = '#ef4444';
            } else {
                const colors = TILE_COLORS[type] || TILE_COLORS.standard;
                ctx.fillStyle = colors.border;
            }
            ctx.globalAlpha = isUserOwned ? 1 : (t.owner_wallet ? 0.8 : 0.3);
            ctx.fillRect(
                t.x_coordinate * MINI_CELL,
                t.y_coordinate * MINI_CELL,
                Math.max(1, MINI_CELL - 0.3),
                Math.max(1, MINI_CELL - 0.3),
            );
        });

        ctx.globalAlpha = 1;

        // Viewport rectangle
        const container = containerRef.current;
        if (container) {
            const cellPx = BASE_CELL * zoom;
            const vx = (-offset.x / cellPx) * MINI_CELL;
            const vy = (-offset.y / cellPx) * MINI_CELL;
            const vw = (container.clientWidth / cellPx) * MINI_CELL;
            const vh = (container.clientHeight / cellPx) * MINI_CELL;

            ctx.strokeStyle = 'rgba(139, 92, 246, 0.8)';
            ctx.lineWidth = 1.5;
            ctx.strokeRect(vx, vy, vw, vh);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.08)';
            ctx.fillRect(vx, vy, vw, vh);
        }

        // Border
        ctx.strokeStyle = 'rgba(255,255,255,0.1)';
        ctx.lineWidth = 1;
        ctx.strokeRect(0, 0, MINI_SIZE, MINI_SIZE);
    }, [territories, userWallet, zoom, offset, containerRef]);

    const handleClick = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const mx = e.clientX - rect.left;
        const my = e.clientY - rect.top;
        const gx = Math.floor(mx / MINI_CELL);
        const gy = Math.floor(my / MINI_CELL);
        onJump(gx, gy);
    }, [onJump, MINI_CELL]);

    return (
        <div className="grid2d-minimap">
            <canvas
                ref={miniRef}
                style={{ width: MINI_SIZE, height: MINI_SIZE, borderRadius: '8px', display: 'block' }}
                onClick={handleClick}
            />
        </div>
    );
}

// ── Legend Item ──
function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="grid2d-legend-item">
            <div className="grid2d-legend-dot" style={{ backgroundColor: color, color }} />
            <span className="grid2d-legend-label">{label}</span>
        </div>
    );
}

// ── Rounded rect helper ──
function roundRect(
    ctx: CanvasRenderingContext2D,
    x: number, y: number, w: number, h: number, r: number,
) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
}
