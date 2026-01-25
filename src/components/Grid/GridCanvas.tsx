'use client';

import { useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Stars } from '@react-three/drei';
import GridCell from './GridCell';
import { useGrid } from '@/hooks/useGrid';
import BattleModal from '../UI/BattleModal';

interface GridCanvasProps {
    selectedCell: { x: number, y: number } | null;
    onCellClick?: (x: number, y: number) => void;
}

export default function GridCanvas({ selectedCell, onCellClick }: GridCanvasProps) {
    const { territories, isLoading } = useGrid();
    const [hoveredCell, setHoveredCell] = useState<{ x: number, y: number } | null>(null);
    const [showBattleModal, setShowBattleModal] = useState(false);

    const GRID_SIZE = 50;

    const handleCellClick = (x: number, y: number) => {
        if (typeof onCellClick === 'function') {
            onCellClick(x, y);
        }
    };

    const safeTerritories = territories || [];
    const selectedTerritory = selectedCell
        ? safeTerritories.find(t => t.x_coordinate === selectedCell.x && t.y_coordinate === selectedCell.y)
        : undefined;

    const attackerTerritory = safeTerritories.find(t => t.x_coordinate === 25 && t.y_coordinate === 25);

    const confirmBattle = (stake: number) => {
        alert(`Initiating battle with ${stake} $EMPIRE stake!`);
        setShowBattleModal(false);
    };

    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                if (showBattleModal) setShowBattleModal(false);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [showBattleModal]);

    return (
        <div className="w-full h-full relative bg-[#050510]">
            <Canvas shadows style={{ pointerEvents: 'auto' }}>
                <PerspectiveCamera makeDefault position={[30, 40, 30]} fov={50} />
                <OrbitControls
                    enablePan={true}
                    enableZoom={true}
                    enableRotate={true}
                    maxPolarAngle={Math.PI / 2.1}
                    minDistance={10}
                    maxDistance={100}
                    target={[25, 0, 25]}
                />

                <ambientLight intensity={0.4} />
                <directionalLight
                    position={[50, 50, 25]}
                    intensity={1.5}
                    color="#a78bfa"
                    castShadow
                    shadow-mapSize={[2048, 2048]}
                />
                <pointLight position={[0, 20, 0]} intensity={0.5} color="#3b82f6" />
                <pointLight position={[50, 20, 50]} intensity={0.5} color="#ec4899" />
                <hemisphereLight args={['#8b5cf6', '#000000', 0.4]} />

                <Stars radius={100} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

                <group>
                    {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
                        const x = index % GRID_SIZE;
                        const z = Math.floor(index / GRID_SIZE);
                        const territory = territories?.find(
                            t => t.x_coordinate === x && t.y_coordinate === z
                        );

                        return (
                            <GridCell
                                key={`${x}-${z}`}
                                x={x}
                                y={z}
                                territory={territory || null}
                                isSelected={selectedCell?.x === x && selectedCell?.y === z}
                                isHovered={hoveredCell?.x === x && hoveredCell?.y === z}
                                onClick={() => handleCellClick(x, z)}
                                onPointerEnter={() => setHoveredCell({ x, y: z })}
                                onPointerLeave={() => setHoveredCell(null)}
                            />
                        );
                    })}
                </group>
            </Canvas>

            {showBattleModal && selectedTerritory && attackerTerritory && (
                <BattleModal
                    attacker={attackerTerritory}
                    defender={selectedTerritory}
                    onClose={() => setShowBattleModal(false)}
                    onConfirm={confirmBattle}
                />
            )}

            {hoveredCell && !selectedCell && (
                <div className="absolute top-4 left-4 glass-panel px-4 py-2 rounded-lg pointer-events-none z-10 flex flex-col">
                    <span className="text-xs text-gray-400 font-mono">Position</span>
                    <span className="text-lg font-bold text-white font-mono">({hoveredCell.x}, {hoveredCell.y})</span>
                </div>
            )}

            {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/80 z-50 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-white text-xl font-bold font-heading">Loading Grid...</div>
                    </div>
                </div>
            )}
        </div>
    );
}
