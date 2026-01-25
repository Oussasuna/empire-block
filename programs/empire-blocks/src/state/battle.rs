use anchor_lang::prelude::*;

#[account]
pub struct Battle {
    pub attacker: Pubkey,            // 32
    pub defender: Pubkey,            // 32
    pub attacker_territory: Pubkey,  // 32
    pub target_territory: Pubkey,    // 32
    pub attacker_stake: u64,         // 8
    pub defender_stake: u64,         // 8
    pub winner: Option<Pubkey>,      // 33 (1 + 32)
    pub status: BattleStatus,        // 1
    pub initiated_at: i64,           // 8
    pub responded_at: Option<i64>,   // 9 (1 + 8)
    pub resolved_at: Option<i64>,    // 9 (1 + 8)
    pub battle_result: Option<BattleResult>, // 2 (1 + 1)
    pub bump: u8,                    // 1
}

impl Battle {
    pub const LEN: usize = 8 + 32 + 32 + 32 + 32 + 8 + 8 + 33 + 1 + 8 + 9 + 9 + 2 + 1;
    pub const RESPONSE_WINDOW: i64 = 86400; // 24 hours in seconds
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BattleStatus {
    Pending,      // Waiting for defender response
    Active,       // Both staked, ready to resolve
    Resolved,     // Completed
    Cancelled,    // Defender didn't respond
    Forfeited,    // Attacker withdrew
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BattleResult {
    AttackerWon,
    DefenderWon,
}
