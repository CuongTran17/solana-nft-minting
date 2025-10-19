# 🎨 Solana NFT Minting Program

Chương trình Solana để mint NFT với image upload (IPFS) và custom attributes, được xây dựng bằng Anchor Framework.

## ✨ Tính năng

- ✅ Khởi tạo NFT Collection với max supply
- ✅ Mint NFT với metadata đầy đủ (tên, symbol, description, URI)
- ✅ **Hỗ trợ 2 loại ảnh**: URL từ web HOẶC upload file lên IPFS
- ✅ Upload ảnh lên IPFS qua Pinata (nếu dùng file local)
- ✅ Custom attributes (Xuất xứ, Tuổi, Cân nặng, Độ dài)
- ✅ Interactive CLI cho người dùng nhập liệu
- ✅ Retry logic cho upload (chống lỗi network)
- ✅ Tự động tạo Associated Token Account
- ✅ Tích hợp Metaplex Token Metadata

## 🛠️ Tech Stack

- **Anchor Framework**: 0.29.0
- **Solana**: Devnet
- **Metaplex Token Metadata**: 4.1.2
- **IPFS**: Pinata API
- **Language**: Rust + TypeScript
- **Modules**: ES2020

---

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/CuongTran17/solana-nft-minting.git
cd solana-nft-minting

# Cài đặt dependencies
npm install

# Build program
npm run build
```

## ⚙️ Cấu hình

Tạo file `.env` trong thư mục `tests/`:

```env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
```

**Lưu ý**: 
- Chỉ cần setup Pinata nếu muốn upload file ảnh local lên IPFS
- Nếu dùng URL ảnh có sẵn (từ web) thì không cần Pinata
- Hướng dẫn lấy API keys: Xem `PINATA_SETUP.md`

## 🚀 Sử dụng

### 1. Deploy Program lên Devnet

```bash
npm run deploy
```

### 2. Mint NFT (Interactive - Khuyến nghị)

```bash
npm run mint:interactive
```

CLI sẽ hỏi:
- **URL ảnh hoặc đường dẫn file** 
  - URL web: `https://i.imgur.com/abc.png` (nhanh, không cần upload)
  - File local: `tests/images/nft1.png` (upload lên IPFS)
- Tên, Symbol, Mô tả NFT
- 4 thuộc tính: Xuất xứ, Tuổi, Cân nặng, Độ dài

**Ví dụ sử dụng:**

```bash
# Mint với URL ảnh (nhanh nhất)
🖼️  Nhập URL ảnh: https://i.imgur.com/your-image.png

# Mint với file local (upload lên IPFS)
🖼️  Nhập đường dẫn file: tests/images/my-nft.png
```

---

## 📁 Cấu trúc Project

```
solana-nft-minting/
├── programs/
│   └── nft-minting/
│       └── src/
│           ├── lib.rs              # Program chính
│           ├── error.rs            # Custom errors
│           ├── instructions/       # Logic mint NFT
│           │   ├── initialize.rs   # Initialize collection
│           │   ├── mint_nft.rs     # Mint NFT
│           │   └── mod.rs
│           └── state/              # Collection state
│               ├── nft_data.rs     # NFT data models
│               └── mod.rs
├── tests/
│   ├── mint-interactive.ts         # CLI tương tác ⭐
│   ├── mint-nft-simple.ts          # Script đơn giản
│   ├── utils/                      # Utils tái sử dụng
│   │   ├── pinata.ts              # IPFS upload
│   │   ├── metadata.ts            # NFT metadata
│   │   └── solana.ts              # Blockchain logic
│   └── images/                     # Chứa ảnh để test
├── Anchor.toml                     # Config Anchor
├── package.json                    # Dependencies
└── README.md
```

---

## 🔧 Chi tiết kỹ thuật

### Smart Contract (Rust)

**Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`

#### Instructions

**1. `initialize(max_supply: u64)`**
- Khởi tạo NFT collection với max supply
- Tạo PDA account lưu collection state
- Authority = deployer wallet

**2. `mint_nft(name: String, symbol: String, uri: String)`**
- Kiểm tra: `total_minted < max_supply`
- Tạo mint account mới (NFT)
- Tạo metadata qua Metaplex CPI
- Tự động tăng counter `total_minted`

#### State Structure

```rust
#[account]
pub struct NftCollection {
    pub authority: Pubkey,      // Collection owner
    pub total_minted: u64,      // Counter (hiện tại)
    pub max_supply: u64,        // Giới hạn (10,000)
    pub bump: u8,               // PDA bump seed
}
```

#### PDA (Program Derived Address)

Collection PDA được tạo từ seed:
```rust
seeds = [b"nft_collection"]
```

---

### TypeScript Client

#### Utility Modules

**1. `tests/utils/pinata.ts`** - IPFS Upload
- `uploadImageToPinata(filePath)`: Upload ảnh → trả về IPFS URL
- `uploadMetadataToPinata(metadata)`: Upload JSON metadata
- Retry logic: 3 lần, backoff 2s/4s/6s
- Timeout: 60s cho ảnh, 30s cho metadata

**2. `tests/utils/metadata.ts`** - NFT Metadata
```typescript
interface NFTAttributes {
    origin: string;    // Xuất xứ
    age: number;       // Tuổi
    weight: number;    // Cân nặng (kg)
    length: number;    // Độ dài (cm)
}

createNFTMetadata(name, description, imageUri, attributes)
```

**3. `tests/utils/solana.ts`** - Blockchain Logic
- `findCollectionPDA()`: Tìm PDA của collection
- `findMetadataPDA(mint)`: PDA của metadata (Metaplex)
- `mintNFTOnChain(program, name, symbol, uri)`: Execute mint transaction

#### Scripts

**`tests/mint-interactive.ts`** ⭐
- CLI với prompts cho người dùng
- Hỗ trợ URL ảnh HOẶC file local
- Validation input đầy đủ
- Confirmation step trước khi mint

**`tests/mint-nft-simple.ts`**
- Script automation với config hardcoded
- Phù hợp cho batch minting
- Testing & CI/CD

---

## 💡 Flow hoạt động

### Complete Mint Flow

```
1. User Input (Interactive CLI)
   ├─ Image (URL or file path)
   ├─ NFT info (name, symbol, description)
   └─ Attributes (4 fields)

2. Image Handling
   ├─ If URL → Use directly
   └─ If file → Upload to IPFS (Pinata)

3. Create Metadata JSON
   ├─ Name, symbol, description
   ├─ Image URL
   └─ Attributes array

4. Upload Metadata to IPFS
   └─ Get metadata URI

5. Blockchain Transaction
   ├─ Generate mint keypair
   ├─ Derive PDAs (collection, metadata)
   ├─ Call program.methods.mintNft(name, symbol, metadataUri)
   └─ Sign & send transaction

6. On-chain Execution
   ├─ Validate max supply
   ├─ Create ATA (Associated Token Account)
   ├─ Mint 1 token
   ├─ Create Metaplex metadata
   └─ Increment total_minted counter

7. Success ✅
   ├─ NFT Address
   ├─ Transaction signature
   └─ Explorer link
```

---

## 💰 Chi phí

Mỗi NFT minted trên Devnet/Mainnet:
- **Rent**: ~0.014 SOL (accounts)
- **Transaction fee**: ~0.00001 SOL
- **Total**: ~0.015 SOL/NFT

---

## 🔍 Troubleshooting

### Lỗi: "IPFS upload failed"
- **Nguyên nhân**: Network timeout hoặc API key sai
- **Giải pháp**: 
  - Kiểm tra `.env` có đúng API keys
  - Script tự retry 3 lần
  - Hoặc dùng URL ảnh thay vì upload file

### Lỗi: "Max supply reached"
- **Nguyên nhân**: Đã mint đủ 10,000 NFTs
- **Giải pháp**: Collection sold out, không thể mint thêm

### Lỗi: "Insufficient funds"
- **Nguyên nhân**: Wallet không đủ SOL
- **Giải pháp**: 
  ```bash
  solana airdrop 2 --url devnet
  ```

---

## 📚 Tài liệu tham khảo

- [Anchor Framework](https://www.anchor-lang.com/)
- [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/)
- [Solana Cookbook](https://solanacookbook.com/)
- [Pinata IPFS](https://docs.pinata.cloud/)

---

## 📝 License

MIT License

## 👨‍💻 Author

**CuongTran17**
- GitHub: [@CuongTran17](https://github.com/CuongTran17)
- Repository: [solana-nft-minting](https://github.com/CuongTran17/solana-nft-minting)

---

**Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`  
**Network**: Solana Devnet  
**Collection**: 8/10,000 NFTs minted  
**Last Updated**: October 19, 2025
