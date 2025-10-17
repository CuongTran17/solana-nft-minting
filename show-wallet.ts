import { Keypair } from "@solana/web3.js";
import * as fs from "fs";
import * as bip39 from "bip39";

// Đọc keypair từ file
const keypairFile = process.env.HOME + "/.config/solana/id.json";
const keypairData = JSON.parse(fs.readFileSync(keypairFile, "utf-8"));
const keypair = Keypair.fromSecretKey(Uint8Array.from(keypairData));

// Lấy seed từ secret key (32 bytes đầu)
const seed = keypair.secretKey.slice(0, 32);

// Tạo mnemonic từ entropy
const mnemonic = bip39.entropyToMnemonic(Buffer.from(seed).toString('hex'));

console.log("╔═══════════════════════════════════════════════════════════════╗");
console.log("║                    THÔNG TIN VÍ SOLANA                        ║");
console.log("╚═══════════════════════════════════════════════════════════════╝");
console.log();
console.log("📍 Địa chỉ ví (Public Key):");
console.log("   " + keypair.publicKey.toBase58());
console.log();
console.log("🔑 Recovery Phrase (12 từ):");
console.log("   " + mnemonic);
console.log();
console.log("� Lưu ý quan trọng:");
console.log("   - KHÔNG BAO GIỜ chia sẻ recovery phrase với ai!");
console.log("   - Viết ra giấy và cất ở nơi an toàn");
console.log("   - Có recovery phrase = có toàn quyền truy cập ví");
console.log("   - Mất recovery phrase = mất vĩnh viễn quyền truy cập");
console.log();

