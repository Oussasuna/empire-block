use anchor_lang::prelude::*;

#[account]
pub struct Territory {
    pub x: u8,                       // 1
    pub y: u8,                       // 1
    pub owner: Pubkey,               // 32
    pub block_type: BlockType,       // 1
    pub empire_id: Option<u32>,      // 5 (1 + 4)
    pub revenue_multiplier: u16,     // 2 (basis points)
    pub mint_address: Pubkey,        // 32
    pub metadata_uri: String,        // 4 + 200
    pub last_sale_price: u64,        // 8
    pub total_revenue_earned: u64,   // 8
    pub purchase_timestamp: i64,     // 8
    pub visual_config: VisualConfig, // 16
    pub bump: u8,                    // 1
}

impl Territory {
    pub const LEN: usize = 8 + 1 + 1 + 32 + 1 + 5 + 2 + 32 + 204 + 8 + 8 + 8 + 16 + 1;
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy, PartialEq, Eq)]
pub enum BlockType {
    Standard,
    Capital,
    Corner,
    Border,
}

impl BlockType {
    pub fn base_multiplier(&self) -> u16 {
        match self {
            BlockType::Standard => 100,  // 1.0x
            BlockType::Border => 100,    // 1.0x (has defense bonus)
            BlockType::Capital => 200,   // 2.0x
            BlockType::Corner => 300,    // 3.0x
        }
    }

    pub fn defense_bonus(&self) -> u16 {
        match self {
            BlockType::Border => 120,    // +20% defense
            _ => 100,                    // No bonus
        }
    }
}

#[derive(AnchorSerialize, AnchorDeserialize, Clone, Copy)]
pub struct VisualConfig {
    pub color_r: u8,
    pub color_g: u8,
    pub color_b: u8,
    pub pattern: u8,
    pub logo_index: u16,
    pub reserved: [u8; 10],
}

impl Default for VisualConfig {
    fn default() -> Self {
        Self {
            color_r: 100,
            color_g: 100,
            color_b: 100,
            pattern: 0,
            logo_index: 0,
            reserved: [0; 10],
        }
    }
}
