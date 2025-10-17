pub fn mint_nft(ctx: Context<MintNft>, metadata: String) -> Result<()> {
    let nft_data = &mut ctx.accounts.nft_data;
    nft_data.metadata = metadata;
    nft_data.owner = ctx.accounts.owner.key();
    nft_data.mint_time = Clock::get()?.unix_timestamp;

    Ok(())
}

#[derive(Accounts)]
pub struct MintNft<'info> {
    #[account(mut)]
    pub owner: Signer<'info>,
    #[account(init, payer = owner, space = NftData::LEN)]
    pub nft_data: Account<'info, NftData>,
    pub system_program: Program<'info, System>,
}