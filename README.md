# 🎨 Solana NFT Minting Program

Chương trình Solana để mint NFT với collection management, được xây dựng bằng Anchor Framework.

## ✨ Tính năng

- ✅ Khởi tạo NFT Collection với max supply
- ✅ Mint NFT với metadata (tên, symbol, URI)
- ✅ Tự động tạo Associated Token Account
- ✅ Tích hợp Metaplex Token Metadata
- ✅ Đếm số NFT đã mint
- ✅ Giới hạn max supply

## 🛠️ Tech Stack

- **Anchor Framework**: 0.29.0
- **Solana**: Devnet
- **Metaplex Token Metadata**: 4.1.2
- **Language**: Rust + TypeScript

## 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/YOUR_USERNAME/solana-nft-minting.git
cd solana-nft-minting

# Cài đặt dependencies
npm install

# Build program
npm run build
```

## 🚀 Sử dụng

### 1. Deploy lên Devnet

```bash
npm run deploy
```

### 2. Mint NFT

```bash
npm run mint
```

## 📁 Cấu trúc Project

```
solana-nft-minting/
├── programs/
│   └── nft-minting/
│       └── src/
│           └── lib.rs          # Solana program logic
├── tests/
│   └── mint-nft-simple.ts      # Mint NFT script
├── target/
│   ├── deploy/                 # Compiled program
│   └── idl/                    # Interface Definition Language
├── Anchor.toml                 # Anchor configuration
├── package.json                # Node dependencies
└── tsconfig.json              # TypeScript config
```

## 🔧 Program Architecture

### Accounts

- **NftCollection**: Quản lý collection
  - `authority`: Người tạo collection
  - `total_minted`: Số NFT đã mint
  - `max_supply`: Số NFT tối đa
  - `bump`: PDA bump seed

### Instructions

1. **initialize**: Khởi tạo NFT collection
   - Input: `max_supply: u64`
   - Tạo PDA account để lưu thông tin collection

2. **mint_nft**: Mint một NFT mới
   - Input: `name`, `symbol`, `uri`
   - Tạo mint account, token account, metadata
   - Tăng `total_minted` counter

## 📝 Program ID

```
44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9
```

View on Solana Explorer:
- [Program](https://explorer.solana.com/address/44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9?cluster=devnet)

## 🧪 Testing

```bash
# Mint một NFT test
npm run mint
```

## 📚 Tài liệu

- [Anchor Documentation](https://www.anchor-lang.com/)
- [Solana Documentation](https://docs.solana.com/)
- [Metaplex Documentation](https://docs.metaplex.com/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License

## 👤 Author

Your Name

## 🔗 Links

- [Solana Devnet Explorer](https://explorer.solana.com/?cluster=devnet)
- [Anchor Book](https://book.anchor-lang.com/)
