/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * EMPIRE BLOCKS - DETERMINISTIC BATTLE SYSTEM
 * ═══════════════════════════════════════════════════════════════════════════════
 * 
 * A fully deterministic, no-gambling battle system for the Empire Blocks
 * Solana blockchain strategy game.
 * 
 * Features:
 * - Stat-based combat with predictable outcomes
 * - Unit counter system (rock-paper-scissors)
 * - Territory NFT rarity bonuses
 * - Terrain modifiers
 * - Battle simulation and rewards
 * 
 * @author Empire Blocks Team
 * @version 1.0.0
 */

// ═══════════════════════════════════════════════════════════════════════════════
// TYPES & INTERFACES
// ═══════════════════════════════════════════════════════════════════════════════

export type UnitType = 'infantry' | 'cavalry' | 'archers' | 'siege';
export type TerrainType = 'plains' | 'forest' | 'mountains' | 'desert' | 'coastal';
export type Rarity = 'common' | 'rare' | 'epic' | 'legendary';
export type BattlePhase = 'preparation' | 'combat' | 'resolution';

export interface UnitStats {
    power: number;
    defense: number;
    hp: number;
    speed: number;
    strongAgainst: UnitType | null;
    weakAgainst: UnitType | null;
}

export interface Army {
    infantry: number;
    cavalry: number;
    archers: number;
    siege: number;
}

export interface Territory {
    id: string;
    name: string;
    owner: string;
    rarity: Rarity;
    terrain: TerrainType;
    garrison: Army;
    fortificationLevel: number; // 0-5
    resourceProduction: number;
}

export interface BattleUnit {
    type: UnitType;
    count: number;
    currentHp: number;
    maxHp: number;
}

export interface BattleState {
    phase: BattlePhase;
    round: number;
    attackerArmy: BattleUnit[];
    defenderArmy: BattleUnit[];
    attackerTotalDamageDealt: number;
    defenderTotalDamageDealt: number;
    log: BattleLogEntry[];
}

export interface BattleLogEntry {
    round: number;
    attacker: string;
    defender: string;
    damage: number;
    remainingHp: number;
    message: string;
}

export interface BattleResult {
    winner: 'attacker' | 'defender';
    attackerLosses: Army;
    defenderLosses: Army;
    attackerSurvivors: Army;
    defenderSurvivors: Army;
    totalRounds: number;
    rewards: BattleRewards;
    battleLog: BattleLogEntry[];
}

export interface BattleRewards {
    resources: number;
    experience: number;
    territoryCapture: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════════
// CONSTANTS & CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Base stats for each unit type
 */
export const UNIT_STATS: Record<UnitType, UnitStats> = {
    infantry: {
        power: 10,
        defense: 8,
        hp: 100,
        speed: 5,
        strongAgainst: 'archers',
        weakAgainst: 'cavalry',
    },
    cavalry: {
        power: 15,
        defense: 5,
        hp: 80,
        speed: 10,
        strongAgainst: 'infantry',
        weakAgainst: 'archers',
    },
    archers: {
        power: 12,
        defense: 4,
        hp: 60,
        speed: 7,
        strongAgainst: 'cavalry',
        weakAgainst: 'infantry',
    },
    siege: {
        power: 20,
        defense: 3,
        hp: 50,
        speed: 2,
        strongAgainst: null, // Strong against fortifications
        weakAgainst: 'cavalry',
    },
};

/**
 * Rarity multipliers for territory defense
 */
export const RARITY_DEFENSE_BONUS: Record<Rarity, number> = {
    common: 1.0,
    rare: 1.15,
    epic: 1.35,
    legendary: 1.6,
};

/**
 * Rarity resource production multipliers
 */
export const RARITY_PRODUCTION_BONUS: Record<Rarity, number> = {
    common: 1.0,
    rare: 1.25,
    epic: 1.5,
    legendary: 2.0,
};

/**
 * Terrain modifiers for attack and defense
 */
export const TERRAIN_MODIFIERS: Record<TerrainType, { attack: number; defense: number }> = {
    plains: { attack: 1.0, defense: 1.0 },
    forest: { attack: 0.9, defense: 1.2 },
    mountains: { attack: 0.8, defense: 1.4 },
    desert: { attack: 1.1, defense: 0.9 },
    coastal: { attack: 1.0, defense: 1.1 },
};

/**
 * Fortification defense bonus per level (0-5)
 */
export const FORTIFICATION_BONUS: number[] = [1.0, 1.1, 1.25, 1.4, 1.6, 1.85];

/**
 * Counter bonus when unit attacks its weak target
 */
export const COUNTER_BONUS = 1.5;

/**
 * Minimum damage dealt (prevents complete damage negation)
 */
export const MIN_DAMAGE_PERCENT = 0.1;

/**
 * Attacker advantage threshold (attacker needs this much more power to guarantee win)
 */
export const ATTACKER_THRESHOLD = 1.2;

// ═══════════════════════════════════════════════════════════════════════════════
// UTILITY FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates an empty army
 */
export function createEmptyArmy(): Army {
    return {
        infantry: 0,
        cavalry: 0,
        archers: 0,
        siege: 0,
    };
}

/**
 * Calculates total unit count in an army
 */
export function getTotalUnits(army: Army): number {
    return army.infantry + army.cavalry + army.archers + army.siege;
}

/**
 * Checks if army has any units
 */
export function hasUnits(army: Army): boolean {
    return getTotalUnits(army) > 0;
}

/**
 * Clones an army object
 */
export function cloneArmy(army: Army): Army {
    return { ...army };
}

/**
 * Converts Army to BattleUnit array for combat simulation
 */
export function armyToBattleUnits(army: Army): BattleUnit[] {
    const units: BattleUnit[] = [];

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const type of unitTypes) {
        const count = army[type];
        if (count > 0) {
            const stats = UNIT_STATS[type];
            units.push({
                type,
                count,
                currentHp: stats.hp * count,
                maxHp: stats.hp * count,
            });
        }
    }

    return units;
}

/**
 * Converts BattleUnit array back to Army
 */
export function battleUnitsToArmy(units: BattleUnit[]): Army {
    const army = createEmptyArmy();

    for (const unit of units) {
        if (unit.currentHp > 0) {
            const stats = UNIT_STATS[unit.type];
            // Calculate surviving units based on remaining HP
            const survivingUnits = Math.ceil(unit.currentHp / stats.hp);
            army[unit.type] = Math.min(survivingUnits, unit.count);
        }
    }

    return army;
}

// ═══════════════════════════════════════════════════════════════════════════════
// COMBAT CALCULATIONS
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculates the raw attack power of an army
 */
export function calculateArmyPower(army: Army): number {
    let totalPower = 0;

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const type of unitTypes) {
        const count = army[type];
        if (count > 0) {
            totalPower += UNIT_STATS[type].power * count;
        }
    }

    return totalPower;
}

/**
 * Calculates the raw defense power of an army
 */
export function calculateArmyDefense(army: Army): number {
    let totalDefense = 0;

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const type of unitTypes) {
        const count = army[type];
        if (count > 0) {
            totalDefense += UNIT_STATS[type].defense * count;
        }
    }

    return totalDefense;
}

/**
 * Calculates the total HP of an army
 */
export function calculateArmyHp(army: Army): number {
    let totalHp = 0;

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const type of unitTypes) {
        const count = army[type];
        if (count > 0) {
            totalHp += UNIT_STATS[type].hp * count;
        }
    }

    return totalHp;
}

/**
 * Calculates average speed of an army (determines attack order)
 */
export function calculateArmySpeed(army: Army): number {
    let totalSpeed = 0;
    let totalUnits = 0;

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const type of unitTypes) {
        const count = army[type];
        if (count > 0) {
            totalSpeed += UNIT_STATS[type].speed * count;
            totalUnits += count;
        }
    }

    return totalUnits > 0 ? totalSpeed / totalUnits : 0;
}

/**
 * Calculates counter bonus based on army compositions
 */
export function calculateCounterBonus(attackerArmy: Army, defenderArmy: Army): number {
    let bonus = 1.0;

    const unitTypes: UnitType[] = ['infantry', 'cavalry', 'archers', 'siege'];

    for (const attackerType of unitTypes) {
        const attackerCount = attackerArmy[attackerType];
        if (attackerCount > 0) {
            const stats = UNIT_STATS[attackerType];
            if (stats.strongAgainst) {
                const targetCount = defenderArmy[stats.strongAgainst];
                if (targetCount > 0) {
                    // Partial counter bonus based on matching units
                    const counterRatio = Math.min(attackerCount, targetCount) / getTotalUnits(attackerArmy);
                    bonus += (COUNTER_BONUS - 1) * counterRatio;
                }
            }
        }
    }

    return bonus;
}

/**
 * Calculates territory defense with all modifiers
 */
export function calculateTerritoryDefense(territory: Territory): number {
    const baseDefense = calculateArmyDefense(territory.garrison);
    const rarityBonus = RARITY_DEFENSE_BONUS[territory.rarity];
    const terrainBonus = TERRAIN_MODIFIERS[territory.terrain].defense;
    const fortBonus = FORTIFICATION_BONUS[territory.fortificationLevel];

    return baseDefense * rarityBonus * terrainBonus * fortBonus;
}

/**
 * Calculates attacker power with terrain modifiers
 */
export function calculateAttackPower(army: Army, terrain: TerrainType): number {
    const basePower = calculateArmyPower(army);
    const terrainMod = TERRAIN_MODIFIERS[terrain].attack;

    return basePower * terrainMod;
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE SIMULATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Quick battle prediction without full simulation
 * Returns probability estimate (0-1) that attacker wins
 */
export function predictBattleOutcome(
    attackerArmy: Army,
    territory: Territory
): { attackerWinChance: number; expectedRounds: number } {
    const attackPower = calculateAttackPower(attackerArmy, territory.terrain);
    const counterBonus = calculateCounterBonus(attackerArmy, territory.garrison);
    const effectiveAttack = attackPower * counterBonus;

    const defenseStrength = calculateTerritoryDefense(territory);
    const defenderCounterBonus = calculateCounterBonus(territory.garrison, attackerArmy);
    const effectiveDefense = defenseStrength * defenderCounterBonus;

    const attackerHp = calculateArmyHp(attackerArmy);
    const defenderHp = calculateArmyHp(territory.garrison);

    // Calculate effective combat scores
    const attackerScore = effectiveAttack * attackerHp;
    const defenderScore = effectiveDefense * defenderHp * ATTACKER_THRESHOLD;

    const totalScore = attackerScore + defenderScore;
    const attackerWinChance = totalScore > 0 ? attackerScore / totalScore : 0.5;

    // Estimate rounds based on HP pools
    const avgDamage = (effectiveAttack + effectiveDefense) / 2;
    const expectedRounds = avgDamage > 0 ? Math.ceil((attackerHp + defenderHp) / avgDamage) : 10;

    return {
        attackerWinChance: Math.round(attackerWinChance * 100) / 100,
        expectedRounds: Math.min(expectedRounds, 20),
    };
}

/**
 * Simulates a single combat round
 */
function simulateCombatRound(
    state: BattleState,
    attackerArmy: Army,
    defenderArmy: Army,
    territory: Territory
): void {
    state.round++;

    // Calculate speeds to determine attack order
    const attackerSpeed = calculateArmySpeed(attackerArmy);
    const defenderSpeed = calculateArmySpeed(defenderArmy);

    const attackerGoesFirst = attackerSpeed >= defenderSpeed;

    if (attackerGoesFirst) {
        // Attacker attacks first
        applyDamage(state, 'attacker', attackerArmy, defenderArmy, territory);

        // Defender counter-attacks if still alive
        if (hasUnitsRemaining(state.defenderArmy)) {
            applyDamage(state, 'defender', defenderArmy, attackerArmy, territory);
        }
    } else {
        // Defender attacks first
        applyDamage(state, 'defender', defenderArmy, attackerArmy, territory);

        // Attacker counter-attacks if still alive
        if (hasUnitsRemaining(state.attackerArmy)) {
            applyDamage(state, 'attacker', attackerArmy, defenderArmy, territory);
        }
    }
}

/**
 * Checks if battle units have HP remaining
 */
function hasUnitsRemaining(units: BattleUnit[]): boolean {
    return units.some(u => u.currentHp > 0);
}

/**
 * Applies damage from one side to another
 */
function applyDamage(
    state: BattleState,
    attackingSide: 'attacker' | 'defender',
    attackingArmy: Army,
    defendingArmy: Army,
    territory: Territory
): void {
    const attackingUnits = attackingSide === 'attacker' ? state.attackerArmy : state.defenderArmy;
    const defendingUnits = attackingSide === 'attacker' ? state.defenderArmy : state.attackerArmy;

    // Calculate damage
    let totalDamage = 0;

    for (const unit of attackingUnits) {
        if (unit.currentHp <= 0) continue;

        const stats = UNIT_STATS[unit.type];
        const survivingUnits = Math.ceil(unit.currentHp / stats.hp);
        let unitDamage = stats.power * survivingUnits;

        // Apply counter bonus
        if (stats.strongAgainst) {
            const targetUnit = defendingUnits.find(u => u.type === stats.strongAgainst && u.currentHp > 0);
            if (targetUnit) {
                unitDamage *= COUNTER_BONUS;
            }
        }

        totalDamage += unitDamage;
    }

    // Apply terrain modifier for attacker only
    if (attackingSide === 'attacker') {
        totalDamage *= TERRAIN_MODIFIERS[territory.terrain].attack;
    }

    // Calculate defense
    let totalDefense = 0;
    for (const unit of defendingUnits) {
        if (unit.currentHp <= 0) continue;

        const stats = UNIT_STATS[unit.type];
        const survivingUnits = Math.ceil(unit.currentHp / stats.hp);
        totalDefense += stats.defense * survivingUnits;
    }

    // Apply territory bonuses for defender
    if (attackingSide === 'attacker') {
        totalDefense *= RARITY_DEFENSE_BONUS[territory.rarity];
        totalDefense *= TERRAIN_MODIFIERS[territory.terrain].defense;
        totalDefense *= FORTIFICATION_BONUS[territory.fortificationLevel];
    }

    // Calculate final damage (minimum 10% of raw damage)
    const finalDamage = Math.max(
        totalDamage - totalDefense,
        totalDamage * MIN_DAMAGE_PERCENT
    );

    // Distribute damage across defending units
    let remainingDamage = Math.floor(finalDamage);

    for (const unit of defendingUnits) {
        if (remainingDamage <= 0 || unit.currentHp <= 0) continue;

        const damageToUnit = Math.min(remainingDamage, unit.currentHp);
        unit.currentHp -= damageToUnit;
        remainingDamage -= damageToUnit;
    }

    // Track total damage
    if (attackingSide === 'attacker') {
        state.attackerTotalDamageDealt += finalDamage;
    } else {
        state.defenderTotalDamageDealt += finalDamage;
    }

    // Log the attack
    const targetName = attackingSide === 'attacker' ? 'Defender' : 'Attacker';
    const remainingHp = defendingUnits.reduce((sum, u) => sum + Math.max(0, u.currentHp), 0);

    state.log.push({
        round: state.round,
        attacker: attackingSide === 'attacker' ? 'Attacker' : 'Defender',
        defender: targetName,
        damage: Math.floor(finalDamage),
        remainingHp: Math.floor(remainingHp),
        message: `${attackingSide === 'attacker' ? 'Attacker' : 'Defender'} deals ${Math.floor(finalDamage)} damage. ${targetName} has ${Math.floor(remainingHp)} HP remaining.`,
    });
}

/**
 * Runs a full battle simulation
 */
export function simulateBattle(
    attackerArmy: Army,
    territory: Territory,
    maxRounds: number = 20
): BattleResult {
    // Initialize battle state
    const state: BattleState = {
        phase: 'combat',
        round: 0,
        attackerArmy: armyToBattleUnits(attackerArmy),
        defenderArmy: armyToBattleUnits(territory.garrison),
        attackerTotalDamageDealt: 0,
        defenderTotalDamageDealt: 0,
        log: [],
    };

    // Initial log entry
    state.log.push({
        round: 0,
        attacker: 'Battle',
        defender: 'Start',
        damage: 0,
        remainingHp: 0,
        message: `Battle begins! Attacker: ${getTotalUnits(attackerArmy)} units vs Defender: ${getTotalUnits(territory.garrison)} units at ${territory.name}`,
    });

    // Combat loop
    while (
        state.round < maxRounds &&
        hasUnitsRemaining(state.attackerArmy) &&
        hasUnitsRemaining(state.defenderArmy)
    ) {
        simulateCombatRound(state, attackerArmy, territory.garrison, territory);
    }

    // Determine winner
    const attackerRemaining = hasUnitsRemaining(state.attackerArmy);
    const defenderRemaining = hasUnitsRemaining(state.defenderArmy);

    let winner: 'attacker' | 'defender';

    if (!attackerRemaining && !defenderRemaining) {
        // Both destroyed - defender wins (holds territory)
        winner = 'defender';
    } else if (!attackerRemaining) {
        winner = 'defender';
    } else if (!defenderRemaining) {
        winner = 'attacker';
    } else {
        // Timeout - compare remaining HP
        const attackerHp = state.attackerArmy.reduce((sum, u) => sum + Math.max(0, u.currentHp), 0);
        const defenderHp = state.defenderArmy.reduce((sum, u) => sum + Math.max(0, u.currentHp), 0);
        winner = attackerHp > defenderHp ? 'attacker' : 'defender';
    }

    // Calculate survivors
    const attackerSurvivors = battleUnitsToArmy(state.attackerArmy);
    const defenderSurvivors = battleUnitsToArmy(state.defenderArmy);

    // Calculate losses
    const attackerLosses: Army = {
        infantry: attackerArmy.infantry - attackerSurvivors.infantry,
        cavalry: attackerArmy.cavalry - attackerSurvivors.cavalry,
        archers: attackerArmy.archers - attackerSurvivors.archers,
        siege: attackerArmy.siege - attackerSurvivors.siege,
    };

    const defenderLosses: Army = {
        infantry: territory.garrison.infantry - defenderSurvivors.infantry,
        cavalry: territory.garrison.cavalry - defenderSurvivors.cavalry,
        archers: territory.garrison.archers - defenderSurvivors.archers,
        siege: territory.garrison.siege - defenderSurvivors.siege,
    };

    // Calculate rewards
    const rewards = calculateRewards(winner, territory, state.round);

    // Final log entry
    state.log.push({
        round: state.round,
        attacker: 'Battle',
        defender: 'End',
        damage: 0,
        remainingHp: 0,
        message: `Battle ended! ${winner === 'attacker' ? 'Attacker wins!' : 'Defender holds!'} Rounds: ${state.round}`,
    });

    return {
        winner,
        attackerLosses,
        defenderLosses,
        attackerSurvivors,
        defenderSurvivors,
        totalRounds: state.round,
        rewards,
        battleLog: state.log,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// REWARDS SYSTEM
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Calculates battle rewards based on outcome
 */
export function calculateRewards(
    winner: 'attacker' | 'defender',
    territory: Territory,
    rounds: number
): BattleRewards {
    const baseResources = territory.resourceProduction * RARITY_PRODUCTION_BONUS[territory.rarity];

    if (winner === 'attacker') {
        return {
            resources: Math.floor(baseResources * 2), // Loot bonus
            experience: 100 + (rounds * 10), // More XP for longer battles
            territoryCapture: true,
        };
    } else {
        return {
            resources: Math.floor(baseResources * 0.5), // Defense bonus
            experience: 50 + (rounds * 5),
            territoryCapture: false,
        };
    }
}

// ═══════════════════════════════════════════════════════════════════════════════
// ARMY BUILDER UTILITIES
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates an army from unit counts
 */
export function createArmy(
    infantry: number = 0,
    cavalry: number = 0,
    archers: number = 0,
    siege: number = 0
): Army {
    return {
        infantry: Math.max(0, infantry),
        cavalry: Math.max(0, cavalry),
        archers: Math.max(0, archers),
        siege: Math.max(0, siege),
    };
}

/**
 * Calculates army recruitment cost
 */
export function calculateArmyCost(army: Army): number {
    const costs = {
        infantry: 10,
        cavalry: 25,
        archers: 15,
        siege: 50,
    };

    return (
        army.infantry * costs.infantry +
        army.cavalry * costs.cavalry +
        army.archers * costs.archers +
        army.siege * costs.siege
    );
}

/**
 * Suggests optimal army composition against a territory
 */
export function suggestArmyComposition(
    territory: Territory,
    budget: number
): { army: Army; cost: number; winChance: number } {
    const garrison = territory.garrison;

    // Analyze enemy composition
    const enemyInfantry = garrison.infantry;
    const enemyCavalry = garrison.cavalry;
    const enemyArchers = garrison.archers;

    // Counter strategy:
    // - Infantry beats Archers
    // - Cavalry beats Infantry
    // - Archers beat Cavalry

    const costs = {
        infantry: 10,
        cavalry: 25,
        archers: 15,
        siege: 50,
    };

    let remainingBudget = budget;
    const army = createEmptyArmy();

    // Prioritize counters
    if (enemyArchers > 0 && remainingBudget >= costs.infantry) {
        const count = Math.min(
            Math.floor(remainingBudget * 0.3 / costs.infantry),
            enemyArchers * 2
        );
        army.infantry = count;
        remainingBudget -= count * costs.infantry;
    }

    if (enemyInfantry > 0 && remainingBudget >= costs.cavalry) {
        const count = Math.min(
            Math.floor(remainingBudget * 0.4 / costs.cavalry),
            enemyInfantry * 2
        );
        army.cavalry = count;
        remainingBudget -= count * costs.cavalry;
    }

    if (enemyCavalry > 0 && remainingBudget >= costs.archers) {
        const count = Math.min(
            Math.floor(remainingBudget * 0.3 / costs.archers),
            enemyCavalry * 2
        );
        army.archers = count;
        remainingBudget -= count * costs.archers;
    }

    // Add siege if fortified
    if (territory.fortificationLevel >= 2 && remainingBudget >= costs.siege) {
        const count = Math.floor(remainingBudget * 0.2 / costs.siege);
        army.siege = count;
        remainingBudget -= count * costs.siege;
    }

    // Fill remaining with balanced units
    while (remainingBudget >= costs.infantry) {
        army.infantry++;
        remainingBudget -= costs.infantry;
    }

    const cost = calculateArmyCost(army);
    const prediction = predictBattleOutcome(army, territory);

    return {
        army,
        cost,
        winChance: prediction.attackerWinChance,
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// TERRITORY MANAGEMENT
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Creates a new territory
 */
export function createTerritory(
    id: string,
    name: string,
    owner: string,
    rarity: Rarity = 'common',
    terrain: TerrainType = 'plains',
    garrison?: Army
): Territory {
    return {
        id,
        name,
        owner,
        rarity,
        terrain,
        garrison: garrison || createEmptyArmy(),
        fortificationLevel: 0,
        resourceProduction: 100,
    };
}

/**
 * Upgrades territory fortification
 */
export function upgradeFortification(territory: Territory): Territory {
    if (territory.fortificationLevel >= 5) {
        return territory;
    }

    return {
        ...territory,
        fortificationLevel: territory.fortificationLevel + 1,
    };
}

/**
 * Adds units to territory garrison
 */
export function reinforceTerritory(territory: Territory, reinforcements: Army): Territory {
    return {
        ...territory,
        garrison: {
            infantry: territory.garrison.infantry + reinforcements.infantry,
            cavalry: territory.garrison.cavalry + reinforcements.cavalry,
            archers: territory.garrison.archers + reinforcements.archers,
            siege: territory.garrison.siege + reinforcements.siege,
        },
    };
}

// ═══════════════════════════════════════════════════════════════════════════════
// BATTLE REPORT GENERATION
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Generates a formatted battle report
 */
export function generateBattleReport(result: BattleResult, territory: Territory): string {
    const lines: string[] = [];

    lines.push('╔══════════════════════════════════════════════════════════════╗');
    lines.push('║                    BATTLE REPORT                             ║');
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push(`║ Territory: ${territory.name.padEnd(48)}║`);
    lines.push(`║ Terrain: ${territory.terrain.padEnd(50)}║`);
    lines.push(`║ Rarity: ${territory.rarity.padEnd(51)}║`);
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push(`║ RESULT: ${(result.winner === 'attacker' ? 'ATTACKER VICTORY!' : 'DEFENDER HOLDS!').padEnd(51)}║`);
    lines.push(`║ Rounds: ${result.totalRounds.toString().padEnd(51)}║`);
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ ATTACKER LOSSES:                                             ║');
    lines.push(`║   Infantry: ${result.attackerLosses.infantry.toString().padEnd(48)}║`);
    lines.push(`║   Cavalry:  ${result.attackerLosses.cavalry.toString().padEnd(48)}║`);
    lines.push(`║   Archers:  ${result.attackerLosses.archers.toString().padEnd(48)}║`);
    lines.push(`║   Siege:    ${result.attackerLosses.siege.toString().padEnd(48)}║`);
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ DEFENDER LOSSES:                                             ║');
    lines.push(`║   Infantry: ${result.defenderLosses.infantry.toString().padEnd(48)}║`);
    lines.push(`║   Cavalry:  ${result.defenderLosses.cavalry.toString().padEnd(48)}║`);
    lines.push(`║   Archers:  ${result.defenderLosses.archers.toString().padEnd(48)}║`);
    lines.push(`║   Siege:    ${result.defenderLosses.siege.toString().padEnd(48)}║`);
    lines.push('╠══════════════════════════════════════════════════════════════╣');
    lines.push('║ REWARDS:                                                     ║');
    lines.push(`║   Resources: ${result.rewards.resources.toString().padEnd(47)}║`);
    lines.push(`║   Experience: ${result.rewards.experience.toString().padEnd(46)}║`);
    lines.push(`║   Territory Captured: ${(result.rewards.territoryCapture ? 'YES' : 'NO').padEnd(38)}║`);
    lines.push('╚══════════════════════════════════════════════════════════════╝');

    return lines.join('\n');
}

// ═══════════════════════════════════════════════════════════════════════════════
// EXAMPLE USAGE / TEST
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Example battle demonstration
 */
export function runExampleBattle(): void {
    console.log('\n🏰 EMPIRE BLOCKS - BATTLE SYSTEM DEMO 🏰\n');

    // Create a territory
    const territory = createTerritory(
        'territory_001',
        'Dragon\'s Peak',
        'defender_wallet_address',
        'epic',
        'mountains',
        createArmy(20, 10, 15, 5)
    );

    // Upgrade fortifications
    const fortifiedTerritory = upgradeFortification(upgradeFortification(territory));

    console.log('📍 Target Territory:', fortifiedTerritory.name);
    console.log('   Rarity:', fortifiedTerritory.rarity);
    console.log('   Terrain:', fortifiedTerritory.terrain);
    console.log('   Fortification Level:', fortifiedTerritory.fortificationLevel);
    console.log('   Garrison:', fortifiedTerritory.garrison);
    console.log('');

    // Create attacking army
    const attackingArmy = createArmy(30, 20, 25, 10);

    console.log('⚔️ Attacking Army:');
    console.log('   ', attackingArmy);
    console.log('   Cost:', calculateArmyCost(attackingArmy));
    console.log('');

    // Predict outcome
    const prediction = predictBattleOutcome(attackingArmy, fortifiedTerritory);
    console.log('📊 Battle Prediction:');
    console.log('   Win Chance:', `${(prediction.attackerWinChance * 100).toFixed(1)}%`);
    console.log('   Expected Rounds:', prediction.expectedRounds);
    console.log('');

    // Run battle
    console.log('⚔️ BATTLE BEGINS! ⚔️\n');
    const result = simulateBattle(attackingArmy, fortifiedTerritory);

    // Show battle log
    console.log('📜 Battle Log:');
    for (const entry of result.battleLog) {
        console.log(`   [Round ${entry.round}] ${entry.message}`);
    }
    console.log('');

    // Show report
    console.log(generateBattleReport(result, fortifiedTerritory));

    // Test army suggestion
    console.log('\n💡 Suggested Counter-Army (Budget: 1000):');
    const suggestion = suggestArmyComposition(fortifiedTerritory, 1000);
    console.log('   Army:', suggestion.army);
    console.log('   Cost:', suggestion.cost);
    console.log('   Estimated Win Chance:', `${(suggestion.winChance * 100).toFixed(1)}%`);
}

// Run example if executed directly
if (typeof require !== 'undefined' && require.main === module) {
    runExampleBattle();
}
