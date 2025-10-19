import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import path from "path";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const IDL = require("../target/idl/nft_minting.json");

// Metaplex Token Metadata Program ID
const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");

// Pinata API keys
const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

interface NFTAttributes {
  origin: string;
  height: number;
  weight: number;
  age: number;
}

interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
  properties: {
    files: Array<{
      uri: string;
      type: string;
    }>;
    category: string;
  };
}

/**
 * Upload hình ảnh lên Pinata (IPFS)
 */
async function uploadImageToPinata(imagePath: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📤 Uploading image to IPFS... (Attempt ${attempt}/${retries})`);
      console.log("   Path:", imagePath);
      
      // Kiểm tra file có tồn tại không
      if (!fs.existsSync(imagePath)) {
        throw new Error(`File not found: ${imagePath}`);
      }

      const formData = new FormData();
      formData.append("file", fs.createReadStream(imagePath));

      const fileName = path.basename(imagePath);
      const pinataMetadata = JSON.stringify({
        name: `NFT-${fileName}-${Date.now()}`,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${(formData as any)._boundary}`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
          timeout: 60000,
        }
      );

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ Image uploaded successfully!");
      console.log("   IPFS Hash:", response.data.IpfsHash);
      console.log("   URL:", imageUrl);
      return imageUrl;
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      if (error.response) {
        console.error("   Response:", error.response.data);
      }
      
      if (attempt < retries) {
        const waitTime = attempt * 2000;
        console.log(`   Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw error;
      }
    }
  }
  throw new Error("Upload failed");
}

/**
 * Tạo metadata JSON cho NFT
 */
function createNFTMetadata(
  name: string,
  symbol: string,
  description: string,
  imageUrl: string,
  attributes: NFTAttributes
): NFTMetadata {
  return {
    name,
    symbol,
    description,
    image: imageUrl,
    attributes: [
      {
        trait_type: "Nguồn gốc",
        value: attributes.origin,
      },
      {
        trait_type: "Chiều cao (cm)",
        value: attributes.height,
      },
      {
        trait_type: "Cân nặng (kg)",
        value: attributes.weight,
      },
      {
        trait_type: "Tuổi",
        value: attributes.age,
      },
    ],
    properties: {
      files: [
        {
          uri: imageUrl,
          type: "image/png",
        },
      ],
      category: "image",
    },
  };
}

/**
 * Upload metadata JSON lên Pinata
 */
async function uploadMetadataToPinata(metadata: NFTMetadata): Promise<string> {
  try {
    console.log("📤 Uploading metadata to IPFS...");

    const response = await axios.post(
      "https://api.pinata.cloud/pinning/pinJSONToIPFS",
      metadata,
      {
        headers: {
          "Content-Type": "application/json",
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET_KEY,
        },
      }
    );

    const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    console.log("✅ Metadata uploaded successfully!");
    console.log("   IPFS Hash:", response.data.IpfsHash);
    console.log("   URL:", metadataUrl);
    return metadataUrl;
  } catch (error: any) {
    console.error("❌ Error uploading metadata:", error.message);
    if (error.response) {
      console.error("   Response:", error.response.data);
    }
    throw error;
  }
}

async function mintNFT(
  imagePath: string,
  nftName: string,
  nftDescription: string,
  attributes: NFTAttributes
) {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const programId = new PublicKey("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");
  const program = new anchor.Program(IDL, programId, provider);
  const payer = provider.wallet as anchor.Wallet;

  console.log("=".repeat(70));
  console.log("🎨 Minting NFT with Custom Image & Attributes");
  console.log("=".repeat(70));
  console.log("Program ID:", programId.toString());
  console.log("Payer:", payer.publicKey.toString());
  console.log();

  const [nftCollectionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("nft_collection")],
    programId
  );

  console.log("NFT Collection PDA:", nftCollectionPda.toString());
  console.log();

  try {
    // Step 0: Check Pinata credentials
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error("Please set PINATA_API_KEY and PINATA_SECRET_KEY in .env file");
    }

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

      await new Promise(resolve => setTimeout(resolve, 2000));
      collectionData = await program.account.nftCollection.fetch(nftCollectionPda);
    }

    // Step 1: Upload image
    console.log("-".repeat(70));
    console.log("STEP 1: Uploading Image");
    console.log("-".repeat(70));
    const imageUrl = await uploadImageToPinata(imagePath);
    console.log();

    // Step 2: Create and upload metadata
    console.log("-".repeat(70));
    console.log("STEP 2: Creating & Uploading Metadata");
    console.log("-".repeat(70));
    const nftSymbol = "MYNFT";
    const metadata = createNFTMetadata(
      nftName,
      nftSymbol,
      nftDescription,
      imageUrl,
      attributes
    );

    console.log("📝 NFT Metadata Preview:");
    console.log("   Name:", metadata.name);
    console.log("   Symbol:", metadata.symbol);
    console.log("   Description:", metadata.description);
    console.log("   Attributes:");
    metadata.attributes.forEach(attr => {
      console.log(`      • ${attr.trait_type}: ${attr.value}`);
    });
    console.log();

    const metadataUrl = await uploadMetadataToPinata(metadata);
    console.log();

    // Step 3: Mint NFT on-chain
    console.log("-".repeat(70));
    console.log("STEP 3: Minting NFT On-Chain");
    console.log("-".repeat(70));
    
    const mintKeypair = Keypair.generate();
    console.log("🔑 New Mint Address:", mintKeypair.publicKey.toString());

    const tokenAccount = await getAssociatedTokenAddress(
      mintKeypair.publicKey,
      payer.publicKey
    );

    const [metadataPda] = PublicKey.findProgramAddressSync(
      [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      METADATA_PROGRAM_ID
    );

    console.log("📍 Token Account:", tokenAccount.toString());
    console.log("📍 Metadata PDA:", metadataPda.toString());
    console.log();

    console.log("⏳ Sending transaction...");

    const tx = await program.methods
      .mintNft(nftName, nftSymbol, metadataUrl)
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
    console.log("🎉 SUCCESS! NFT MINTED!");
    console.log("=".repeat(70));
    console.log();
    console.log("📋 Transaction Details:");
    console.log(`   Signature: ${tx}`);
    console.log();
    console.log("🔗 Solana Explorer Links:");
    console.log(`   Transaction: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
    console.log(`   NFT Mint: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`);
    console.log(`   Token Account: https://explorer.solana.com/address/${tokenAccount.toString()}?cluster=devnet`);
    console.log();
    console.log("🖼️  NFT Resources:");
    console.log(`   Image: ${imageUrl}`);
    console.log(`   Metadata: ${metadataUrl}`);
    console.log();

    const updatedCollection: any = await program.account.nftCollection.fetch(nftCollectionPda);
    console.log("📊 Collection Stats:");
    console.log(`   Total Minted: ${updatedCollection.totalMinted.toString()}/${updatedCollection.maxSupply.toString()}`);
    console.log();
    console.log("=".repeat(70));

  } catch (error: any) {
    console.log();
    console.error("=".repeat(70));
    console.error("❌ ERROR OCCURRED");
    console.error("=".repeat(70));
    console.error("Message:", error.message || error);
    if (error.logs) {
      console.log("\n📜 Program Logs:");
      error.logs.forEach((log: string) => console.log("  ", log));
    }
    console.error("=".repeat(70));
    throw error;
  }
}

// =============================================================================
// MAIN EXECUTION - CHẠY THỬ Ở ĐÂY
// =============================================================================

async function main() {
  console.log("\n");
  console.log("🚀 Starting NFT Minting Test...\n");

  // CẤU HÌNH NFT CỦA BẠN Ở ĐÂY
  const config = {
    // Đường dẫn đến hình ảnh
    imagePath: "tests/images/image.png", // Sửa đường dẫn này

    // Thông tin NFT
    name: "Nhân Sâm Ngọc Linh #1",
    description: "Củ nhân sâm quý hiếm từ Ngọc Linh, Việt Nam. Được trồng và chăm sóc tự nhiên trong 5 năm.",

    // Các thuộc tính
    attributes: {
      origin: "Ngọc Linh, Kon Tum, Việt Nam",
      height: 15,  // cm
      weight: 8,   // kg
      age: 5,      // năm
    }
  };

  console.log("📋 Configuration:");
  console.log("   Image:", config.imagePath);
  console.log("   Name:", config.name);
  console.log("   Description:", config.description);
  console.log("   Origin:", config.attributes.origin);
  console.log("   Height:", config.attributes.height, "cm");
  console.log("   Weight:", config.attributes.weight, "kg");
  console.log("   Age:", config.attributes.age, "years");
  console.log();

  // Kiểm tra file tồn tại
  if (!fs.existsSync(config.imagePath)) {
    console.error("❌ Error: Image file not found!");
    console.error(`   Looking for: ${path.resolve(config.imagePath)}`);
    console.error("\n💡 Tips:");
    console.error("   1. Create 'images' folder in your project root");
    console.error("   2. Add your NFT image there");
    console.error("   3. Update the imagePath in config");
    process.exit(1);
  }

  await mintNFT(
    config.imagePath,
    config.name,
    config.description,
    config.attributes
  );
}

main().then(
  () => {
    console.log("\n✅ Test completed successfully!");
    process.exit(0);
  },
  (err) => {
    console.error("\n❌ Test failed!");
    console.error(err);
    process.exit(1);
  }
);