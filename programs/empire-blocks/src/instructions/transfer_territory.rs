use anchor_lang::prelude::*;
use anchor_lang::system_program;
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
pub struct TransferTerritory<'info> {
    #[account(
        mut,
        seeds = [b"territory", &[territory.x], &[territory.y]],
        bump = territory.bump,
        constraint = territory.owner == seller.key() @ EmpireBlocksError::NotOwner
    )]
    pub territory: Account<'info, Territory>,
    
    #[account(
        mut,
        seeds = [b"grid_state"],
        bump = grid_state.bump
    )]
    pub grid_state: Account<'info, GridState>,
    
    #[account(mut)]
    pub seller: Signer<'info>,
    
    /// CHECK: Buyer wallet - verified in instruction
    #[account(mut)]
    pub buyer: AccountInfo<'info>,
    
    /// CHECK: Protocol treasury PDA
    #[account(
        mut,
        seeds = [b"treasury"],
        bump
    )]
    pub protocol_treasury: AccountInfo<'info>,
    
    pub system_program: Program<'info, System>,
}

pub fn handler(ctx: Context<TransferTerritory>, sale_price: u64) -> Result<()> {
    let grid_state = &mut ctx.accounts.grid_state;
    let territory = &mut ctx.accounts.territory;
    
    // Calculate fee distribution
    let total_fee = sale_price
        .checked_mul(grid_state.protocol_fee_bps as u64)
        .unwrap()
        .checked_div(10000)
        .unwrap();
    
    let owner_share = total_fee
        .checked_mul(GridState::OWNER_SHARE_BPS as u64)
        .unwrap()
        .checked_div(10000)
        .unwrap();
    
    let empire_bonus = total_fee
        .checked_mul(GridState::EMPIRE_BONUS_BPS as u64)
        .unwrap()
        .checked_div(10000)
        .unwrap();
    
    let treasury_share = total_fee
        .checked_mul(GridState::TREASURY_SHARE_BPS as u64)
        .unwrap()
        .checked_div(10000)
        .unwrap();
    
    let seller_receives = sale_price.checked_sub(total_fee).unwrap();
    
    // Transfer SOL from buyer to seller
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.seller.to_account_info(),
            },
        ),
        seller_receives,
    )?;
    
    // Transfer fee to treasury
    system_program::transfer(
        CpiContext::new(
            ctx.accounts.system_program.to_account_info(),
            system_program::Transfer {
                from: ctx.accounts.buyer.to_account_info(),
                to: ctx.accounts.protocol_treasury.to_account_info(),
            },
        ),
        total_fee,
    )?;
    
    // Update state
    grid_state.total_volume += sale_price;
    grid_state.total_fees_collected += total_fee;
    grid_state.revenue_pool += owner_share;
    grid_state.empire_bonus_pool += empire_bonus;
    grid_state.treasury_balance += treasury_share;
    
    // Update territory
    territory.owner = ctx.accounts.buyer.key();
    territory.last_sale_price = sale_price;
    territory.purchase_timestamp = Clock::get()?.unix_timestamp;
    
    msg!("Territory transferred: ({}, {}) for {} SOL", 
        territory.x, territory.y, sale_price);
    
    Ok(())
}
