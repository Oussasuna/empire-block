import { useGameProgram } from '@/components/program/game';
import { getLandCoord } from '@/data/landCoordinates';
import { useMemo } from 'react';

export function useMappedCoordinates() {
    const { allLands } = useGameProgram();

    const mappedCoords = useMemo(() => {
        const map = new Map<string, {x: number, y: number, rank: number}>();
        if (!allLands.data) return map;

        // Sort all lands by id ascending (whether incremental or timestamp)
        // so their ranks map to 1...2500 reliably.
        const sorted = [...allLands.data].sort((a, b) => {
            const idA = typeof a.account.id.toNumber === 'function' ? a.account.id.toNumber() : Number(a.account.id);
            const idB = typeof b.account.id.toNumber === 'function' ? b.account.id.toNumber() : Number(b.account.id);
            return idA - idB;
        });

        sorted.forEach((wrapper, index) => {
            const rank = index + 1; // 1-based index for getLandCoord
            const coord = getLandCoord(rank);
            map.set(wrapper.account.id.toString(), {
                x: coord?.x ?? 0,
                y: coord?.y ?? 0,
                rank
            });
        });

        return map;
    }, [allLands.data]);

    return { mappedCoords, isLoading: allLands.isLoading };
}
