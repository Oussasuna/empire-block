/**
 * generate-land-coords.js
 * 
 * Generates the pre-shuffled mapping of Land ID → (x, y, type)
 * for the Empire Blocks 50x50 grid.
 * 
 * Rules:
 *  - 4   Corner tiles:   (0,0),(49,0),(0,49),(49,49)
 *  - 192  Border tiles:   edges excluding corners
 *  - 25   Capital tiles:  23<=x<=27, 23<=y<=27
 *  - 2279 Standard tiles: everything else
 * 
 * The shuffle uses a seeded LCG so the output is deterministic.
 * The same seed must be committed alongside the program.
 * 
 * Run: node scripts/generate-land-coords.js
 */

// --- Seeded LCG random (simple, deterministic) ---
const SEED = 0xDEADBEEF; // fixed seed — change only if you redeploy the program
let lcgState = SEED;

function seededRand() {
    lcgState = (Math.imul(1664525, lcgState) + 1013904223) >>> 0;
    return lcgState / 0x100000000;
}

function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(seededRand() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

// --- Build all 2500 coordinate pairs with their type ---
function getType(x, y) {
    if ((x === 0 && y === 0) || (x === 49 && y === 0) || (x === 0 && y === 49) || (x === 49 && y === 49)) return 'corner';
    if (x === 0 || y === 0 || x === 49 || y === 49) return 'border';
    if (Math.abs(x - 25) <= 2 && Math.abs(y - 25) <= 2) return 'capital';
    return 'standard';
}

const allCoords = [];
for (let x = 0; x < 50; x++) {
    for (let y = 0; y < 50; y++) {
        allCoords.push({ x, y, type: getType(x, y) });
    }
}

// --- Shuffle ---
shuffleArray(allCoords);

// --- Verify counts ---
const counts = { corner: 0, border: 0, capital: 0, standard: 0 };
for (const c of allCoords) counts[c.type]++;
console.error(`Type counts — corner:${counts.corner} border:${counts.border} capital:${counts.capital} standard:${counts.standard}`);
console.error(`Total: ${allCoords.length}`);

// --- Output as TypeScript-ready data ---
// Land IDs are 1-based (first mint gets id=1)
const lines = allCoords.map((c, i) => `  ${i + 1}: { x: ${c.x}, y: ${c.y}, type: '${c.type}' as const },`);

const output = `// AUTO-GENERATED — do NOT edit by hand.
// Regenerate with: node scripts/generate-land-coords.js > src/data/landCoordinates.ts
// Seed: 0xDEADBEEF  (must match program deployment)
//
// Maps Land ID (1-based) → grid coordinate + rarity type
// Counts: corner=4 | capital=25 | border=192 | standard=2279

export type LandType = 'corner' | 'capital' | 'border' | 'standard';

export interface LandCoord {
  x: number;
  y: number;
  type: LandType;
}

export const LAND_COORDS: Record<number, LandCoord> = {
${lines.join('\n')}
};

/**
 * Look up the coordinate + type for a given land ID.
 * Returns undefined if the ID is out of range (1–2500).
 */
export function getLandCoord(id: number): LandCoord | undefined {
  return LAND_COORDS[id];
}

/**
 * Get the block type color key for CSS classes.
 */
export function getLandTypeColor(type: LandType): string {
  const colors: Record<LandType, string> = {
    corner: 'amber',
    capital: 'rose',
    border: 'cyan',
    standard: 'purple',
  };
  return colors[type];
}
`;

console.log(output);
