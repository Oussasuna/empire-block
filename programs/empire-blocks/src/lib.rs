use anchor_lang::prelude::*;

pub mod state;
pub mod instructions;
pub mod errors;

use instructions::*;
use state::*;

declare_id!("EmpBLocksXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"); // Will be generated

#[program]
pub mod empire_blocks {
    use super::*;

    // Initialize the game grid
    pub fn initialize_grid(ctx: Context<InitializeGrid>, grid_size: u8) -> Result<()> {
        instructions::initialize_grid::handler(ctx, grid_size)
    }

    // Mint a new territory NFT
    pub fn mint_territory(
        ctx: Context<MintTerritory>,
        x: u8,
        y: u8,
        block_type: BlockType,
    ) -> Result<()> {
        instructions::mint_territory::handler(ctx, x, y, block_type)
    }

    // Transfer territory ownership (marketplace sale)
    pub fn transfer_territory(
        ctx: Context<TransferTerritory>,
        sale_price: u64,
    ) -> Result<()> {
        instructions::transfer_territory::handler(ctx, sale_price)
    }

    // Update empire when territories change
    pub fn update_empire(
        ctx: Context<UpdateEmpire>,
        territory_ids: Vec<Pubkey>,
    ) -> Result<()> {
        instructions::update_empire::handler(ctx, territory_ids)
    }

    // Initiate a battle for adjacent territory
    pub fn initiate_battle(
        ctx: Context<InitiateBattle>,
        target_territory: Pubkey,
        stake_amount: u64,
    ) -> Result<()> {
        instructions::initiate_battle::handler(ctx, target_territory, stake_amount)
    }

    // Defender responds to battle
    pub fn defend_territory(
        ctx: Context<DefendTerritory>,
        stake_amount: u64,
    ) -> Result<()> {
        instructions::defend_territory::handler(ctx, stake_amount)
    }

    // Resolve battle (oracle-called)
    pub fn resolve_battle(
        ctx: Context<ResolveBattle>,
        battle_result: BattleResult,
    ) -> Result<()> {
        instructions::resolve_battle::handler(ctx, battle_result)
    }
}
