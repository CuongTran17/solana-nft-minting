import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";

const IDL = require("../target/idl/nft_minting.json");

// Metaplex Token Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

async function mintNFT() {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");
  const program = new anchor.Program(IDL, programId, provider);
  const payer = provider.wallet as anchor.Wallet;

  console.log("=".repeat(70));
  console.log("🎨 Minting NFT on Devnet");
  console.log("=".repeat(70));
  console.log("Program ID:", programId.toString());
  console.log("Payer:", payer.publicKey.toString());
  console.log();

  const [nftCollectionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("nft_collection")],
    programId
  );

  console.log("NFT Collection PDA:", nftCollectionPda.toString());

  try {
    let collectionData: any;
    try {
      collectionData = await program.account.nftCollection.fetch(nftCollectionPda);
      console.log("✅ Collection found");
      console.log("   Total Minted:", collectionData.totalMinted.toString());
      console.log("   Max Supply:", collectionData.maxSupply.toString());
      console.log();
    } catch (error) {
      console.log("⚠️  Collection not initialized. Initializing...\n");
      
      const tx = await program.methods
        .initialize(new anchor.BN(10000))
        .accounts({
          nftCollection: nftCollectionPda,
          authority: payer.publicKey,
          systemProgram: SystemProgram.programId,
        })
        .rpc();

      console.log("✅ Collection initialized!");
      console.log("   Transaction:", tx);
      console.log("   Explorer:", `https://explorer.solana.com/tx/${tx}?cluster=devnet`);
      console.log();

      collectionData = await program.account.nftCollection.fetch(nftCollectionPda);
    }

    const mintKeypair = Keypair.generate();
    console.log("🔑 New Mint Keypair:", mintKeypair.publicKey.toString());

    // Use getAssociatedTokenAddress to get the proper ATA
    const tokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer.publicKey
    );

    const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
    const [metadataPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    console.log("Token Account:", tokenAccount.toString());
    console.log("Metadata PDA:", metadataPda.toString());
    console.log();

    const nftName = `My NFT #${collectionData.totalMinted.toNumber() + 1}`;
    const nftSymbol = "MYNFT";
    const nftUri = "https://arweave.net/your-metadata-uri";

    console.log("📝 NFT Metadata:");
    console.log("   Name:", nftName);
    console.log("   Symbol:", nftSymbol);
    console.log("   URI:", nftUri);
    console.log();

    console.log("⏳ Minting NFT...");

    const tx = await program.methods
      .mintNft(nftName, nftSymbol, nftUri)
      .accountsStrict({
        nftCollection: nftCollectionPda,
        mint: mintKeypair.publicKey,
        tokenAccount: tokenAccount,
        metadata: metadataPda,
        payer: payer.publicKey,
        recipient: payer.publicKey,
        rent: SYSVAR_RENT_PUBKEY,
        systemProgram: SystemProgram.programId,
        tokenProgram: TOKEN_PROGRAM_ID,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        metadataProgram: METADATA_PROGRAM_ID,
      })
      .signers([mintKeypair])
      .rpc();

    console.log();
    console.log("=".repeat(70));
    console.log("🎉 SUCCESS! NFT Minted!");
    console.log("=".repeat(70));
    console.log("Transaction:", tx);
    console.log();
    console.log("🔗 View on Solana Explorer:");
    console.log(`   TX: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log(`   Mint: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`);
    console.log(`   Token: https://explorer.solana.com/address/${tokenAccount.toString()}?cluster=devnet`);
    console.log(`   Metadata: https://explorer.solana.com/address/${metadataPda.toString()}?cluster=devnet`);
    console.log();

    const updatedCollection: any = await program.account.nftCollection.fetch(nftCollectionPda);
    console.log("📊 Collection Stats:");
    console.log(`   Total Minted: ${updatedCollection.totalMinted.toString()}/${updatedCollection.maxSupply.toString()}`);
    console.log();

  } catch (error: any) {
    console.error("❌ Error:", error.message || error);
    if (error.logs) {
      console.log("\n📜 Program Logs:");
      error.logs.forEach((log: string) => console.log("  ", log));
    }
  }
}

mintNFT().then(
  () => process.exit(0),
  (err) => {
    console.error(err);
    process.exit(1);
  }
);