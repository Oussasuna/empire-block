use anchor_lang::prelude::*;

#[account]
pub struct Empire {
    pub owner: Pubkey,               // 32
    pub territory_count: u16,        // 2
    pub territories: Vec<Pubkey>,    // 4 + (32 * max_territories)
    pub bonus_multiplier: u16,       // 2 (basis points)
    pub total_revenue: u64,          // 8
    pub formation_timestamp: i64,    // 8
    pub last_updated: i64,           // 8
    pub bump: u8,                    // 1
}

impl Empire {
    // Max 100 territories per empire account
    pub const MAX_TERRITORIES: usize = 100;
    pub const LEN: usize = 8 + 32 + 2 + 4 + (32 * 100) + 2 + 8 + 8 + 8 + 1;

    pub fn calculate_bonus(territory_count: u16) -> u16 {
        match territory_count {
            4..=8 => 110,    // +10%
            9..=15 => 125,   // +25%
            16.. => 150,     // +50%
            _ => 100,        // No bonus
        }
    }

    pub fn is_contiguous(territories: &[(u8, u8)]) -> bool {
        if territories.is_empty() {
            return false;
        }

        let mut visited = vec![false; territories.len()];
        let mut stack = vec![0];
        visited[0] = true;
        let mut count = 1;

        while let Some(idx) = stack.pop() {
            let (x, y) = territories[idx];

            for (i, &(nx, ny)) in territories.iter().enumerate() {
                if !visited[i] && Self::is_adjacent((x, y), (nx, ny)) {
                    visited[i] = true;
                    stack.push(i);
                    count += 1;
                }
            }
        }

        count == territories.len()
    }

    fn is_adjacent(pos1: (u8, u8), pos2: (u8, u8)) -> bool {
        let dx = (pos1.0 as i16 - pos2.0 as i16).abs();
        let dy = (pos1.1 as i16 - pos2.1 as i16).abs();
        (dx == 1 && dy == 0) || (dx == 0 && dy == 1)
    }
}
