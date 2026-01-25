use anchor_lang::prelude::*;

#[account]
pub struct GridState {
    pub authority: Pubkey,           // 32
    pub grid_size: u8,               // 1
    pub total_territories: u16,      // 2
    pub territories_minted: u16,     // 2
    pub protocol_fee_bps: u16,       // 2 (basis points: 500 = 5%)
    pub total_volume: u64,           // 8
    pub total_fees_collected: u64,   // 8
    pub revenue_pool: u64,           // 8
    pub empire_bonus_pool: u64,      // 8
    pub treasury_balance: u64,       // 8
    pub last_distribution: i64,      // 8
    pub bump: u8,                    // 1
}

impl GridState {
    pub const LEN: usize = 8 + 32 + 1 + 2 + 2 + 2 + 8 + 8 + 8 + 8 + 8 + 8 + 1;

    pub const PROTOCOL_FEE_BPS: u16 = 500; // 5%
    pub const OWNER_SHARE_BPS: u16 = 6000; // 60%
    pub const EMPIRE_BONUS_BPS: u16 = 2500; // 25%
    pub const TREASURY_SHARE_BPS: u16 = 1500; // 15%
}
