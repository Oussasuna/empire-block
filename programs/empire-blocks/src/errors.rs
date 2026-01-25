use anchor_lang::prelude::*;

#[error_code]
pub enum EmpireBlocksError {
    #[msg("Invalid coordinates for this grid")]
    InvalidCoordinates,
    
    #[msg("You are not the owner of this territory")]
    NotOwner,
    
    #[msg("Territories must be adjacent to attack")]
    NotAdjacent,
    
    #[msg("Territories are not contiguous")]
    NotContiguous,
    
    #[msg("Cannot attack your own territory")]
    CannotAttackOwnTerritory,
    
    #[msg("Battle is not in the correct status")]
    InvalidBattleStatus,
    
    #[msg("Not authorized for this battle")]
    NotAuthorized,
    
    #[msg("Response window has expired")]
    ResponseWindowExpired,
    
    #[msg("Insufficient stake amount")]
    InsufficientStake,
    
    #[msg("Maximum empire size exceeded")]
    EmpireTooBig,
}
