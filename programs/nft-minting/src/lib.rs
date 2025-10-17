use anchor_lang::prelude::*;
use anchor_spl::associated_token::AssociatedToken;
use anchor_spl::token::{self, Mint, Token, TokenAccount};
use mpl_token_metadata::instructions::{
    CreateMetadataAccountV3, CreateMetadataAccountV3InstructionArgs,
};

declare_id!("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");

#[program]
pub mod nft_minting {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>, max_supply: u64) -> Result<()> {
        let nft_collection = &mut ctx.accounts.nft_collection;
        nft_collection.authority = ctx.accounts.authority.key();
        nft_collection.total_minted = 0;
        nft_collection.max_supply = max_supply;
        nft_collection.bump = ctx.bumps.nft_collection;
        
        msg!("NFT Collection initialized with max supply: {}", max_supply);
        Ok(())
    }

    pub fn mint_nft(
        ctx: Context<MintNFT>,
        name: String,
        symbol: String,
        uri: String,
    ) -> Result<()> {
        let nft_collection = &mut ctx.accounts.nft_collection;
        
        require!(
            nft_collection.total_minted < nft_collection.max_supply,
            NftError::MaxSupplyReached
        );

        // Create Associated Token Account
        let cpi_program = ctx.accounts.associated_token_program.to_account_info();
        let cpi_accounts = anchor_spl::associated_token::Create {
            payer: ctx.accounts.payer.to_account_info(),
            associated_token: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.recipient.to_account_info(),
            mint: ctx.accounts.mint.to_account_info(),
            system_program: ctx.accounts.system_program.to_account_info(),
            token_program: ctx.accounts.token_program.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);
        anchor_spl::associated_token::create(cpi_ctx)?;

        // Mint 1 token to the token account
        token::mint_to(
            CpiContext::new(
                ctx.accounts.token_program.to_account_info(),
                token::MintTo {
                    mint: ctx.accounts.mint.to_account_info(),
                    to: ctx.accounts.token_account.to_account_info(),
                    authority: ctx.accounts.payer.to_account_info(),
                },
            ),
            1,
        )?;

        // Create metadata
        let create_metadata_ix = CreateMetadataAccountV3 {
            metadata: ctx.accounts.metadata.key(),
            mint: ctx.accounts.mint.key(),
            mint_authority: ctx.accounts.payer.key(),
            payer: ctx.accounts.payer.key(),
            update_authority: (ctx.accounts.payer.key(), true),
            system_program: ctx.accounts.system_program.key(),
            rent: Some(ctx.accounts.rent.key()),
        };

        let metadata_args = CreateMetadataAccountV3InstructionArgs {
            data: mpl_token_metadata::types::DataV2 {
                name,
                symbol,
                uri,
                seller_fee_basis_points: 0,
                creators: None,
                collection: None,
                uses: None,
            },
            is_mutable: true,
            collection_details: None,
        };

        let ix = create_metadata_ix.instruction(metadata_args);

        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.metadata.to_account_info(),
                ctx.accounts.mint.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
                ctx.accounts.rent.to_account_info(),
            ],
        )?;

        nft_collection.total_minted += 1;

        msg!("NFT minted successfully! Total: {}/{}", 
            nft_collection.total_minted, 
            nft_collection.max_supply
        );

        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(
        init,
        payer = authority,
        space = 8 + 32 + 8 + 8 + 1,
        seeds = [b"nft_collection"],
        bump
    )]
    pub nft_collection: Account<'info, NftCollection>,
    
    #[account(mut)]
    pub authority: Signer<'info>,
    
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct MintNFT<'info> {
    #[account(
        mut,
        seeds = [b"nft_collection"],
        bump = nft_collection.bump
    )]
    pub nft_collection: Account<'info, NftCollection>,

    #[account(
        init,
        payer = payer,
        mint::decimals = 0,
        mint::authority = payer,
    )]
    pub mint: Account<'info, Mint>,

    /// CHECK: Will be created by ATA program
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    /// CHECK: PDA for metadata
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    #[account(mut)]
    pub payer: Signer<'info>,

    /// CHECK: Token recipient
    pub recipient: UncheckedAccount<'info>,

    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}

#[account]
pub struct NftCollection {
    pub authority: Pubkey,
    pub total_minted: u64,
    pub max_supply: u64,
    pub bump: u8,
}

#[error_code]
pub enum NftError {
    #[msg("Maximum supply of NFTs has been reached")]
    MaxSupplyReached,
}