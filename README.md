# Solana NFT Minting Program

Chương trình mint NFT trên Solana devnet sử dụng Anchor framework.

## 🚀 Tính năng

- ✅ Khởi tạo NFT Collection với giới hạn supply
- ✅ Mint NFT với metadata (tên, symbol, URI)
- ✅ Tự động tạo Associated Token Account
- ✅ Tích hợp Metaplex Token Metadata

## 📋 Yêu cầu

- Rust 1.75+
- Solana CLI 1.18+
- Anchor CLI 0.32.1+
- Node.js 18+

## 🛠️ Cài đặt

```bash
# Cài dependencies
npm install

# Build program
npm run build
```

## 🚢 Deploy

```bash
# Deploy lên devnet
npm run deploy

# Hoặc build + deploy cùng lúc
npm run build && npm run deploy
```

## 🎨 Mint NFT

```bash
# Mint NFT mới
npm run mint
```

## 📁 Cấu trúc Project

```
.
├── programs/
│   └── nft-minting/
│       └── src/
│           ├── lib.rs              # Smart contract chính
│           ├── error.rs            # Custom errors
│           ├── instructions/       # Instruction modules
│           └── state/              # State structs
├── tests/
│   └── mint-nft-simple.ts         # Script mint NFT
├── target/
│   ├── deploy/                    # Compiled programs
│   └── idl/                       # Interface definitions
├── Anchor.toml                    # Anchor configuration
└── package.json                   # Node dependencies
```

## 🔑 Thông tin Program

- **Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`
- **Cluster**: Devnet
- **Collection PDA**: `7Y1U8JvYqLjjp83m2MENuBUnEVMQdZfV21pYa8JXaxo9`
- **Max Supply**: 10,000 NFTs

## 📝 Instructions

### 1. Initialize Collection

Khởi tạo NFT collection với max supply.

```typescript
await program.methods
  .initialize(new BN(10000))
  .accounts({ ... })
  .rpc();
```

### 2. Mint NFT

Mint NFT mới với metadata.

```typescript
await program.methods
  .mintNft(name, symbol, uri)
  .accountsStrict({ ... })
  .signers([mintKeypair])
  .rpc();
```

## 🔗 Links

- [Program Explorer](https://explorer.solana.com/address/44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9?cluster=devnet)
- [Anchor Documentation](https://www.anchor-lang.com/)
- [Metaplex Documentation](https://docs.metaplex.com/)

## ⚡ Scripts

- npm run build - Build Solana program
- npm run deploy - Deploy to devnet
- npm run mint - Mint new NFT

## 📄 License

MIT
