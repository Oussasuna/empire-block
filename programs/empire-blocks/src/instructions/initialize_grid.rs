use anchor_lang::prelude::*;
use crate::state::*;

#[derive(Accounts)]
pub struct InitializeGrid<'info> {
    #[account(
        init,
        payer = authority,
        space = GridState::LEN,
        seeds = [b"grid_state"],
        bump
    )]
    pub grid_state: Account<'info, GridState>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<InitializeGrid>, grid_size: u8) -> Result<()> {
    let grid_state = &mut ctx.accounts.grid_state;
    
    grid_state.authority = ctx.accounts.authority.key();
    grid_state.grid_size = grid_size;
    grid_state.total_territories = (grid_size as u16) * (grid_size as u16);
    grid_state.territories_minted = 0;
    grid_state.protocol_fee_bps = GridState::PROTOCOL_FEE_BPS;
    grid_state.total_volume = 0;
    grid_state.total_fees_collected = 0;
    grid_state.revenue_pool = 0;
    grid_state.empire_bonus_pool = 0;
    grid_state.treasury_balance = 0;
    grid_state.last_distribution = Clock::get()?.unix_timestamp;
    grid_state.bump = ctx.bumps.grid_state;

    msg!("Grid initialized: {}x{} = {} territories", 
        grid_size, grid_size, grid_state.total_territories);

    Ok(())
}
