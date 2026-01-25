'use client';

import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Mesh, Color } from 'three';
import { Territory } from '@/hooks/useGrid';

interface GridCellProps {
    x: number;
    y: number;
    territory: Territory | null;
    isSelected: boolean;
    isHovered: boolean;
    onClick: () => void;
    onPointerEnter: () => void;
    onPointerLeave: () => void;
}

export default function GridCell({
    x,
    y,
    territory,
    isSelected,
    isHovered,
    onClick,
    onPointerEnter,
    onPointerLeave,
}: GridCellProps) {
    const meshRef = useRef<Mesh>(null);
    const isCorner = territory?.block_type === 'corner';
    const isBorder = territory?.block_type === 'border';
    const isCapital = territory?.block_type === 'capital';

    useFrame((state) => {
        if (meshRef.current) {
            // Height animation
            const targetY = isSelected ? 0.5 : isHovered ? 0.2 : 0;
            meshRef.current.position.y += (targetY - meshRef.current.position.y) * 0.1;

            // Glow animation for special territories
            if (isCorner) {
                const glow = Math.sin(state.clock.elapsedTime * 2) * 0.3 + 0.7;
                meshRef.current.scale.set(1, 1 + glow * 0.1, 1);
            }
        }
    });

    const getColor = () => {
        if (isSelected) return '#10b981';
        if (isHovered) return '#fbbf24';

        if (!territory) return '#111827';

        switch (territory.block_type) {
            case 'corner': return '#fbbf24';
            case 'capital': return '#ef4444';
            case 'border': return '#06b6d4';
            default: return '#6b7280';
        }
    };

    const getHeight = () => {
        if (!territory) return 0.1;
        switch (territory.block_type) {
            case 'corner': return 2.0;
            case 'capital': return 1.2;
            case 'border': return 0.8;
            default: return 0.5;
        }
    };

    return (
        <group position={[x, 0, y]}>
            {/* Main cube */}
            <mesh
                ref={meshRef}
                onClick={onClick}
                onPointerEnter={onPointerEnter}
                onPointerLeave={onPointerLeave}
                castShadow
                receiveShadow
            >
                <boxGeometry args={[0.95, getHeight(), 0.95]} />
                <meshStandardMaterial
                    color={getColor()}
                    metalness={isCorner ? 0.8 : 0.3}
                    roughness={isCorner ? 0.2 : 0.7}
                    emissive={isSelected || isHovered || isCorner ? getColor() : '#000000'}
                    emissiveIntensity={
                        isSelected ? 0.8 :
                            isHovered ? 0.4 :
                                isCorner ? 0.6 :
                                    0
                    }
                />
            </mesh>

            {/* Glow ring for corners */}
            {isCorner && (
                <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
                    <ringGeometry args={[0.4, 0.6, 32]} />
                    <meshBasicMaterial
                        color="#fbbf24"
                        transparent
                        opacity={0.3}
                        side={2}
                    />
                </mesh>
            )}

            {/* Sprite for special territories */}
            {(isCorner || isCapital) && (
                <sprite position={[0, getHeight() + 0.5, 0]} scale={[0.5, 0.5, 1]}>
                    <spriteMaterial
                        color={isCorner ? '#fbbf24' : '#ef4444'}
                        transparent
                        opacity={0.8}
                        depthTest={false}
                    />
                </sprite>
            )}
        </group>
    );
}
