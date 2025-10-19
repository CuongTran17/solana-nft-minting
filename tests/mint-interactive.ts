import * as anchor from "@coral-xyz/anchor";
import { PublicKey, Keypair, SystemProgram, SYSVAR_RENT_PUBKEY } from "@solana/web3.js";
import { TOKEN_PROGRAM_ID, ASSOCIATED_TOKEN_PROGRAM_ID, getAssociatedTokenAddress } from "@solana/spl-token";
import fs from "fs";
import FormData from "form-data";
import axios from "axios";
import path from "path";
import prompts from "prompts";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const IDL = require("../target/idl/nft_minting.json");

const METADATA_PROGRAM_ID = new PublicKey("metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s");
const PROGRAM_ID = new PublicKey("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");

// Pinata API keys
const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

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
 * Upload hình ảnh lên Pinata (IPFS) với retry
 */
async function uploadImageToPinata(imagePath: string, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n📤 Uploading image to IPFS... (Attempt ${attempt}/${retries})`);
      
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
          timeout: 60000, // 60 seconds for images
        }
      );

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ Image uploaded!");
      console.log("   URL:", imageUrl);
      return imageUrl;
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        const waitTime = attempt * 2000;
        console.log(`   Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw new Error(`Failed to upload image after ${retries} attempts: ${error.message}`);
      }
    }
  }
  throw new Error("Upload failed");
}

/**
 * Upload metadata JSON lên Pinata với retry
 */
async function uploadMetadataToPinata(metadata: NFTMetadata, retries = 3): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n📤 Uploading metadata to IPFS... (Attempt ${attempt}/${retries})`);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinJSONToIPFS",
        metadata,
        {
          headers: {
            "Content-Type": "application/json",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
          timeout: 30000, // 30 seconds timeout
        }
      );

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ Metadata uploaded!");
      console.log("   URL:", metadataUrl);
      return metadataUrl;
    } catch (error: any) {
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      if (attempt < retries) {
        const waitTime = attempt * 2000; // 2s, 4s, 6s
        console.log(`   Retrying in ${waitTime / 1000}s...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
      } else {
        throw new Error(`Failed to upload metadata after ${retries} attempts: ${error.message}`);
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
  attributes: Array<{ trait_type: string; value: string | number }>
): NFTMetadata {
  return {
    name,
    symbol,
    description,
    image: imageUrl,
    attributes,
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
 * Mint NFT
 */
async function mintNFT(
  imageUrlOrPath: string,
  nftName: string,
  nftSymbol: string,
  nftDescription: string,
  attributes: Array<{ trait_type: string; value: string | number }>
) {
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = new anchor.Program(IDL, PROGRAM_ID, provider);
  const payer = provider.wallet as anchor.Wallet;

  console.log("\n" + "=".repeat(70));
  console.log("🎨 MINTING NFT");
  console.log("=".repeat(70));
  console.log("Wallet:", payer.publicKey.toString());

  const [nftCollectionPda] = PublicKey.findProgramAddressSync(
    [Buffer.from("nft_collection")],
    PROGRAM_ID
  );

  // Initialize collection if needed
  try {
    await program.account.nftCollection.fetch(nftCollectionPda);
  } catch {
    console.log("\n⚙️  Initializing collection...");
    await program.methods
      .initialize(new anchor.BN(10000))
      .accounts({
        nftCollection: nftCollectionPda,
        authority: payer.publicKey,
        systemProgram: SystemProgram.programId,
      })
      .rpc();
    console.log("✅ Collection initialized!");
  }

  // Step 1: Get image URL (upload if file path, or use URL directly)
  let imageUrl: string;
  
  if (imageUrlOrPath.startsWith('http://') || imageUrlOrPath.startsWith('https://')) {
    // Nếu là URL, dùng trực tiếp
    console.log("\n🔗 Using image URL:", imageUrlOrPath);
    imageUrl = imageUrlOrPath;
  } else {
    // Nếu là file path, upload lên IPFS
    if (!PINATA_API_KEY || !PINATA_SECRET_KEY) {
      throw new Error("Please set PINATA_API_KEY and PINATA_SECRET_KEY in .env file");
    }
    imageUrl = await uploadImageToPinata(imageUrlOrPath);
  }

  // Step 2: Create and upload metadata
  const metadata = createNFTMetadata(
    nftName,
    nftSymbol,
    nftDescription,
    imageUrl,
    attributes
  );

  console.log("\n📝 NFT Metadata:");
  console.log("   Name:", metadata.name);
  console.log("   Symbol:", metadata.symbol);
  console.log("   Description:", metadata.description);
  console.log("   Attributes:");
  metadata.attributes.forEach(attr => {
    console.log(`      • ${attr.trait_type}: ${attr.value}`);
  });

  const metadataUrl = await uploadMetadataToPinata(metadata);

  // Step 3: Mint NFT on-chain
  console.log("\n⏳ Minting NFT on-chain...");
  
  const mintKeypair = Keypair.generate();
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

  console.log("\n" + "=".repeat(70));
  console.log("🎉 SUCCESS! NFT MINTED!");
  console.log("=".repeat(70));
  console.log("\n🔗 Links:");
  console.log(`   Transaction: https://explorer.solana.com/tx/${tx}?cluster=devnet`);
  console.log(`   NFT: https://explorer.solana.com/address/${mintKeypair.publicKey.toString()}?cluster=devnet`);
  console.log(`   Image: ${imageUrl}`);
  console.log(`   Metadata: ${metadataUrl}`);
  console.log("\n" + "=".repeat(70));

  const collection: any = await program.account.nftCollection.fetch(nftCollectionPda);
  console.log(`\n📊 Collection: ${collection.totalMinted.toString()}/${collection.maxSupply.toString()} minted`);
}

/**
 * Main interactive CLI
 */
async function main() {
  console.clear();
  console.log("\n");
  console.log("╔════════════════════════════════════════════════════════════════╗");
  console.log("║           🎨 SOLANA NFT MINTING - INTERACTIVE CLI             ║");
  console.log("╚════════════════════════════════════════════════════════════════╝");
  console.log("\n");

  // Step 1: Image URL or File Path
  const imageResponse = await prompts({
    type: 'text',
    name: 'imageInput',
    message: '�️  Nhập URL ảnh HOẶC đường dẫn file ảnh:',
    initial: 'https://example.com/image.png',
    validate: value => {
      if (!value || value.trim().length === 0) {
        return 'Vui lòng nhập URL hoặc đường dẫn file';
      }
      
      // Nếu là URL, chỉ cần check format
      if (value.startsWith('http://') || value.startsWith('https://')) {
        try {
          new URL(value);
          return true;
        } catch {
          return 'URL không hợp lệ';
        }
      }
      
      // Nếu là file path, check file tồn tại
      if (!fs.existsSync(value)) {
        return `File không tồn tại: ${value}`;
      }
      const ext = path.extname(value).toLowerCase();
      if (!['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
        return 'File phải là ảnh (.png, .jpg, .jpeg, .gif, .webp)';
      }
      return true;
    }
  });

  if (!imageResponse.imageInput) {
    console.log("\n❌ Đã hủy!");
    process.exit(0);
  }

  // Step 2: NFT Basic Info
  const basicInfo = await prompts([
    {
      type: 'text',
      name: 'name',
      message: '🏷️  Tên NFT:',
      initial: 'My NFT',
      validate: value => value.length > 0 ? true : 'Tên không được để trống'
    },
    {
      type: 'text',
      name: 'symbol',
      message: '🔤 Symbol (ký hiệu):',
      initial: 'MYNFT',
      validate: value => value.length > 0 && value.length <= 10 ? true : 'Symbol phải từ 1-10 ký tự'
    },
    {
      type: 'text',
      name: 'description',
      message: '📝 Mô tả NFT:',
      initial: 'A unique NFT on Solana blockchain',
    }
  ]);

  if (!basicInfo.name || !basicInfo.symbol) {
    console.log("\n❌ Đã hủy!");
    process.exit(0);
  }

  // Step 3: Attributes (4 thuộc tính cố định)
  console.log("\n📋 Nhập thông tin thuộc tính cho NFT:\n");

  const attributes = await prompts([
    {
      type: 'text',
      name: 'origin',
      message: '🌍 Xuất xứ (Origin):',
      initial: 'Việt Nam',
      validate: value => value.length > 0 ? true : 'Xuất xứ không được để trống'
    },
    {
      type: 'number',
      name: 'age',
      message: '� Tuổi (Age):',
      initial: 5,
      validate: value => value >= 0 ? true : 'Tuổi phải >= 0'
    },
    {
      type: 'number',
      name: 'weight',
      message: '⚖️  Cân nặng/kg (Weight):',
      initial: 10,
      validate: value => value > 0 ? true : 'Cân nặng phải > 0'
    },
    {
      type: 'number',
      name: 'length',
      message: '📏 Độ dài/cm (Length):',
      initial: 15,
      validate: value => value > 0 ? true : 'Độ dài phải > 0'
    }
  ]);

  if (!attributes.origin || attributes.age === undefined || !attributes.weight || !attributes.length) {
    console.log("\n❌ Đã hủy!");
    process.exit(0);
  }

  // Convert to attributes array format
  const nftAttributes = [
    { trait_type: 'Xuất xứ', value: attributes.origin },
    { trait_type: 'Tuổi', value: attributes.age },
    { trait_type: 'Cân nặng (kg)', value: attributes.weight },
    { trait_type: 'Độ dài (cm)', value: attributes.length }
  ];

  // Step 4: Confirm
  console.log("\n" + "=".repeat(70));
  console.log("📋 XÁC NHẬN THÔNG TIN NFT:");
  console.log("=".repeat(70));
  console.log("�️  Ảnh:", imageResponse.imageInput);
  console.log("🏷️  Tên:", basicInfo.name);
  console.log("🔤 Symbol:", basicInfo.symbol);
  console.log("📝 Mô tả:", basicInfo.description);
  console.log("\n📋 Attributes:");
  nftAttributes.forEach((attr, index) => {
    console.log(`   ${index + 1}. ${attr.trait_type}: ${attr.value}`);
  });
  console.log("=".repeat(70));

  const confirmResponse = await prompts({
    type: 'confirm',
    name: 'confirm',
    message: '✅ Xác nhận mint NFT này?',
    initial: true
  });

  if (!confirmResponse.confirm) {
    console.log("\n❌ Đã hủy!");
    process.exit(0);
  }

  // Step 5: Mint NFT
  try {
    await mintNFT(
      imageResponse.imageInput,
      basicInfo.name,
      basicInfo.symbol,
      basicInfo.description,
      nftAttributes
    );
    
    console.log("\n✅ Hoàn tất!\n");
    process.exit(0);
  } catch (error: any) {
    console.error("\n❌ Lỗi:", error.message);
    process.exit(1);
  }
}

main();
