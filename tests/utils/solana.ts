import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import {
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
} from "@solana/spl-token";

export const METADATA_PROGRAM_ID = new PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
export const PROGRAM_ID = new PublicKey(
  "44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9"
);

/**
 * Tìm Collection PDA
 */
export function findCollectionPDA(programId: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [Buffer.from("collection")],
    programId
  );
}

/**
 * Tìm Metadata PDA
 */
export function findMetadataPDA(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
  );
}

/**
 * Tìm Master Edition PDA
 */
export function findMasterEditionPDA(mint: PublicKey): [PublicKey, number] {
  return PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      METADATA_PROGRAM_ID.toBuffer(),
      mint.toBuffer(),
      Buffer.from("edition"),
    ],
    METADATA_PROGRAM_ID
  );
}

/**
 * Mint NFT on-chain
 */
export async function mintNFTOnChain(
  program: anchor.Program,
  payer: Keypair,
  name: string,
  symbol: string,
  uri: string
): Promise<string> {
  console.log("\n🔗 Minting NFT on Solana blockchain...");

  const mintKeypair = Keypair.generate();
  const [collectionPda] = findCollectionPDA(program.programId);
  const [metadataPda] = findMetadataPDA(mintKeypair.publicKey);
  const [masterEditionPda] = findMasterEditionPDA(mintKeypair.publicKey);

  const tokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    payer.publicKey
  );

  const tx = await program.methods
    .mintNft(name, symbol, uri)
    .accounts({
      collection: collectionPda,
      mint: mintKeypair.publicKey,
      tokenAccount: tokenAccount,
      metadata: metadataPda,
      masterEdition: masterEditionPda,
      payer: payer.publicKey,
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: METADATA_PROGRAM_ID,
    })
    .signers([mintKeypair])
    .rpc();

  console.log("✅ NFT minted successfully!");
  console.log(`📦 Mint address: ${mintKeypair.publicKey.toString()}`);
  console.log(`🔗 Transaction: https://explorer.solana.com/tx/${tx}?cluster=devnet`);

  return mintKeypair.publicKey.toString();
}
