use anchor_lang::prelude::*;

declare_id!("CFqRzR9dPUMhcLYxjFwTyHRocDqe1XEU4rLfGc6uTn7W");

#[program]
pub mod profile {
    use super::*;

    pub fn create_profile(
        ctx: Context<CreateProfile>,
        username: String,
        bio: String,
    ) -> Result<()> {
        require!(username.len() <= 32, ProfileError::UsernameTooLong);
        require!(bio.len() <= 128, ProfileError::BioTooLong);

        let profile = &mut ctx.accounts.profile;
        profile.authority = ctx.accounts.authority.key();
        profile.username = username;
        profile.bio = bio;
        profile.bump = ctx.bumps.profile;

        msg!("Profile created for authority: {}", profile.authority);
        msg!("Username: {}", profile.username);
        Ok(())
    }

    pub fn update_bio(ctx: Context<UpdateProfile>, new_bio: String) -> Result<()> {
        require!(new_bio.len() <= 128, ProfileError::BioTooLong);

        let profile = &mut ctx.accounts.profile;
        profile.bio = new_bio;

        msg!("Bio updated for username: {}", profile.username);
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreateProfile<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + (4 + 32) + (4 + 128) + 1,
        seeds = [b"profile", authority.key().as_ref()],
        bump
    )]
    pub profile: Account<'info, UserProfile>,

    #[account(mut)]
    pub authority: Signer<'info>,

    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct UpdateProfile<'info> {
    #[account(
        mut,
        seeds = [b"profile", authority.key().as_ref()],
        bump = profile.bump,
        has_one = authority @ ProfileError::Unauthorized
    )]
    pub profile: Account<'info, UserProfile>,

    pub authority: Signer<'info>,
}

#[account]
pub struct UserProfile {
    pub authority: Pubkey, // 32
    pub username: String,  // 4 + 32
    pub bio: String,       // 4 + 128
    pub bump: u8,          // 1
}

#[error_code]
pub enum ProfileError {
    #[msg("Username exceeds 32 characters.")]
    UsernameTooLong,
    #[msg("Bio exceeds 128 characters.")]
    BioTooLong,
    #[msg("Unauthorized to update this profile.")]
    Unauthorized,
}
