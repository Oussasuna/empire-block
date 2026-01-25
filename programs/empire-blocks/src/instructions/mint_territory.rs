use anchor_lang::prelude::*;
use anchor_spl::{
    token::{self, Mint, Token, TokenAccount, MintTo},
    associated_token::AssociatedToken,
};
use crate::state::*;
use crate::errors::*;

#[derive(Accounts)]
#[instruction(x: u8, y: u8)]
pub struct MintTerritory<'info> {
    #[account(
        init,
        payer = buyer,
        space = Territory::LEN,
        seeds = [b"territory", &[x], &[y]],
        bump
    )]
    pub territory: Account<'info, Territory>,
    
    #[account(
        mut,
        seeds = [b"grid_state"],
        bump = grid_state.bump
    )]
    pub grid_state: Account<'info, GridState>,
    
    #[account(
        init,
        payer = buyer,
        mint::decimals = 0,
        mint::authority = territory,
        mint::freeze_authority = territory,
    )]
    pub nft_mint: Account<'info, Mint>,
    
    #[account(
        init,
        payer = buyer,
        associated_token::mint = nft_mint,
        associated_token::authority = buyer,
    )]
    pub nft_token_account: Account<'info, TokenAccount>,
    
    #[account(mut)]
    pub buyer: Signer<'info>,
    
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
}

pub fn handler(
    ctx: Context<MintTerritory>,
    x: u8,
    y: u8,
    block_type: BlockType,
) -> Result<()> {
    let grid_state = &mut ctx.accounts.grid_state;
    let territory = &mut ctx.accounts.territory;
    
    // Validate coordinates
    require!(
        x < grid_state.grid_size && y < grid_state.grid_size,
        EmpireBlocksError::InvalidCoordinates
    );
    
    // Determine block type based on position
    let actual_block_type = determine_block_type(x, y, grid_state.grid_size);
    
    // Initialize territory
    territory.x = x;
    territory.y = y;
    territory.owner = ctx.accounts.buyer.key();
    territory.block_type = actual_block_type;
    territory.empire_id = None;
    territory.revenue_multiplier = actual_block_type.base_multiplier();
    territory.mint_address = ctx.accounts.nft_mint.key();
    territory.metadata_uri = format!("https://empire-blocks.io/metadata/{}-{}", x, y);
    territory.last_sale_price = 0;
    territory.total_revenue_earned = 0;
    territory.purchase_timestamp = Clock::get()?.unix_timestamp;
    territory.visual_config = VisualConfig::default();
    territory.bump = ctx.bumps.territory;
    
    // Mint NFT to buyer
    let seeds = &[
        b"territory",
        &[x],
        &[y],
        &[territory.bump],
    ];
    let signer = &[&seeds[..]];
    
    let cpi_accounts = MintTo {
        mint: ctx.accounts.nft_mint.to_account_info(),
        to: ctx.accounts.nft_token_account.to_account_info(),
        authority: territory.to_account_info(),
    };
    let cpi_program = ctx.accounts.token_program.to_account_info();
    let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer);
    
    token::mint_to(cpi_ctx, 1)?;
    
    // Update grid state
    grid_state.territories_minted += 1;
    
    msg!("Territory minted: ({}, {}) - Type: {:?}", x, y, actual_block_type);
    
    Ok(())
}

fn determine_block_type(x: u8, y: u8, grid_size: u8) -> BlockType {
    let max = grid_size - 1;
    
    // Corners
    if (x == 0 && y == 0) || (x == max && y == 0) || 
       (x == 0 && y == max) || (x == max && y == max) {
        return BlockType::Corner;
    }
    
    // Borders
    if x == 0 || y == 0 || x == max || y == max {
        return BlockType::Border;
    }
    
    // Capitals (specific positions - e.g., center and strategic points)
    // This is simplified - you'd have a specific list
    if is_capital_position(x, y, grid_size) {
        return BlockType::Capital;
    }
    
    BlockType::Standard
}

fn is_capital_position(x: u8, y: u8, grid_size: u8) -> bool {
    let center = grid_size / 2;
    let distance = ((x as i16 - center as i16).abs() + (y as i16 - center as i16).abs()) as u8;
    
    // Capitals are within 5 blocks of center (total ~100 positions)
    distance <= 5
}
