# 🎨 Solana NFT Minting Program# 🎨 Solana NFT Minting Program



Chương trình Solana để mint NFT với image upload (IPFS) và custom attributes, được xây dựng bằng Anchor Framework.Chương trình Solana để mint NFT với image upload (IPFS) và custom attributes, được xây dựng bằng Anchor Framework.



## ✨ Tính năng## ✨ Tính năng



- ✅ Khởi tạo NFT Collection với max supply- ✅ Khởi tạo NFT Collection với max supply

- ✅ Mint NFT với metadata đầy đủ (tên, symbol, description, URI)- ✅ Mint NFT với metadata đầy đủ (tên, symbol, description, URI)

- ✅ **Hỗ trợ 2 loại ảnh**: URL từ web HOẶC upload file lên IPFS- ✅ **Hỗ trợ 2 loại ảnh**: URL từ web HOẶC upload file lên IPFS

- ✅ Upload ảnh lên IPFS qua Pinata (nếu dùng file local)- ✅ Upload ảnh lên IPFS qua Pinata (nếu dùng file local)

- ✅ Custom attributes (Xuất xứ, Tuổi, Cân nặng, Độ dài)- ✅ Custom attributes (Xuất xứ, Tuổi, Cân nặng, Độ dài)

- ✅ Interactive CLI cho người dùng nhập liệu- ✅ Interactive CLI cho người dùng nhập liệu

- ✅ Retry logic cho upload (chống lỗi network)- ✅ Retry logic cho upload (chống lỗi network)

- ✅ Tự động tạo Associated Token Account- ✅ Tự động tạo Associated Token Account

- ✅ Tích hợp Metaplex Token Metadata- ✅ Tích hợp Metaplex Token Metadata



## 🛠️ Tech Stack## 🛠️ Tech Stack



- **Anchor Framework**: 0.29.0- **Anchor Framework**: 0.29.0

- **Solana**: Devnet- **Solana**: Devnet

- **Metaplex Token Metadata**: 4.1.2- **Metaplex Token Metadata**: 4.1.2

- **IPFS**: Pinata API- **IPFS**: Pinata API

- **Language**: Rust + TypeScript- **Language**: Rust + TypeScript

- **Modules**: ES2020- **Modules**: ES2020



------



## 📦 Cài đặt## 📦 Cài đặt



```bash```bash

# Clone repository# Clone repository

git clone https://github.com/CuongTran17/solana-nft-minting.gitgit clone https://github.com/CuongTran17/solana-nft-minting.git

cd solana-nft-mintingcd solana-nft-minting



# Cài đặt dependencies# Cài đặt dependencies

npm installnpm install



# Build program# Build program

npm run buildnpm run build

``````



## ⚙️ Cấu hình## ⚙️ Cấu hình



Tạo file `.env` trong thư mục `tests/`:Tạo file `.env` trong thư mục `tests/`:



```env```env

PINATA_API_KEY=your_api_key_herePINATA_API_KEY=your_api_key_here

PINATA_SECRET_KEY=your_secret_key_herePINATA_SECRET_KEY=your_secret_key_here

``````



**Lưu ý**: **Lưu ý**: 

- Chỉ cần setup Pinata nếu muốn upload file ảnh local lên IPFS

- Nếu dùng URL ảnh có sẵn (từ web) thì không cần Pinata- Chỉ cần setup Pinata nếu muốn upload file ảnh local lên IPFS

- Hướng dẫn lấy API keys: Xem `PINATA_SETUP.md`

- **Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`- Nếu dùng URL ảnh có sẵn (từ web) thì không cần Pinata

## 🚀 Sử dụng

- **Network**: Solana Devnet- Hướng dẫn lấy API keys: Xem `PINATA_SETUP.md`

### 1. Deploy Program lên Devnet

- **Max Supply**: 10,000 NFTs

```bash

npm run deploy- **Mint Cost**: ~0.015 SOL per NFT## 🚀 Sử dụng

```

- **Code Size**: ~1,200 lines TypeScript, ~180 lines Rust

### 2. Mint NFT (Interactive - Khuyến nghị)

### 1. Deploy Program lên Devnet

```bash

npm run mint:interactive---

```

```bash

CLI sẽ hỏi:

- **URL ảnh hoặc đường dẫn file** ## II. Smart Contract (Rust)npm run deploy

  - URL web: `https://i.imgur.com/abc.png` (nhanh, không cần upload)

  - File local: `tests/images/nft1.png` (upload lên IPFS)```

- Tên, Symbol, Mô tả NFT

- 4 thuộc tính: Xuất xứ, Tuổi, Cân nặng, Độ dài### Architecture



**Ví dụ sử dụng:**### 2. Mint NFT (Interactive - Khuyến nghị)



```bash```

# Mint với URL ảnh (nhanh nhất)

🖼️  Nhập URL ảnh: https://i.imgur.com/your-image.pngprograms/nft-minting/src/```bash



# Mint với file local (upload lên IPFS)├── lib.rs              # Entry point, program logicnpm run mint:interactive

🖼️  Nhập đường dẫn file: tests/images/my-nft.png

```├── error.rs            # Custom error definitions```



---├── instructions/       # Instruction handlers



## 📁 Cấu trúc Project│   ├── initialize.rs  # Initialize collectionCLI sẽ hỏi:



```│   ├── mint_nft.rs    # Mint NFT logic- **URL ảnh hoặc đường dẫn file** 

solana-nft-minting/

├── programs/│   └── mod.rs         # Module exports  - URL web: `https://i.imgur.com/abc.png` (nhanh, không cần upload)

│   └── nft-minting/

│       └── src/└── state/             # State structures  - File local: `tests/images/nft1.png` (upload lên IPFS)

│           ├── lib.rs              # Program chính

│           ├── instructions/       # Logic mint NFT    ├── nft_data.rs    # NFT data models- Tên, Symbol, Mô tả NFT

│           └── state/              # Collection state

├── tests/    └── mod.rs         # Module exports- 4 thuộc tính: Xuất xứ, Tuổi, Cân nặng, Độ dài

│   ├── mint-interactive.ts         # CLI tương tác ⭐

│   ├── mint-nft-simple.ts          # Script đơn giản```

│   ├── utils/                      # Utils tái sử dụng

│   │   ├── pinata.ts              # Upload IPFS**Ví dụ sử dụng:**

│   │   ├── metadata.ts            # NFT metadata

│   │   └── solana.ts              # Blockchain logic### Program Structure

│   └── images/                     # Chứa ảnh để test

├── Anchor.toml                     # Config Anchor```bash

├── package.json                    # Dependencies

└── README.md#### **Entry Point (`lib.rs`)**# Mint với URL ảnh (nhanh nhất)

```

🖼️  Nhập URL ảnh: https://i.imgur.com/your-image.png

---

```rust

## 🔧 Chi tiết kỹ thuật

declare_id!("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");# Mint với file local (upload lên IPFS)

### Smart Contract (Rust)

🖼️  Nhập đường dẫn file: tests/images/my-nft.png

**Program Structure (`programs/nft-minting/src/lib.rs`):**

#[program]```

```rust

declare_id!("44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9");pub mod nft_minting {



#[program]    use super::*;## 📁 Cấu trúc Project

pub mod nft_minting {

    pub fn initialize(ctx: Context<Initialize>, max_supply: u64) -> Result<()>    

    pub fn mint_nft(ctx: Context<MintNFT>, name: String, symbol: String, uri: String) -> Result<()>

}    pub fn initialize(ctx: Context<Initialize>, max_supply: u64) -> Result<()>```

```

    pub fn mint_nft(ctx: Context<MintNFT>, name: String, symbol: String, uri: String) -> Result<()>solana-nft-minting/

**2 Instructions chính:**

}├── programs/

1. **`initialize(max_supply)`**: Khởi tạo Collection

   - Tạo PDA account lưu thông tin collection```│   └── nft-minting/

   - Set max supply (mặc định: 10,000 NFTs)

   - Authority = deployer│       └── src/



2. **`mint_nft(name, symbol, uri)`**: Mint NFT mới**Chức năng:**│           ├── lib.rs              # Program chính

   - Kiểm tra: `total_minted < max_supply`

   - Tạo mint account mới- `declare_id!`: Khai báo Program ID duy nhất│           ├── instructions/       # Logic mint NFT

   - Call Metaplex CPI để tạo metadata

   - Tự động tăng `total_minted`- `#[program]`: Macro định nghĩa Anchor program│           └── state/              # Collection state



**State Structure (`programs/nft-minting/src/state/nft_data.rs`):**- Expose 2 instructions: `initialize` và `mint_nft`├── tests/



```rust│   ├── mint-interactive.ts         # CLI tương tác ⭐

#[account]

pub struct NftCollection {---│   ├── mint-nft-simple.ts          # Script đơn giản

    pub authority: Pubkey,

    pub total_minted: u64,│   ├── utils/                      # Utils tái sử dụng

    pub max_supply: u64,

    pub bump: u8,### Instructions│   │   ├── pinata.ts              # IPFS upload

}

```│   │   ├── metadata.ts            # Metadata builder



### TypeScript Client#### 1. **Initialize Collection**│   │   └── solana.ts              # Solana helpers



**Utility Modules:**│   └── images/                     # Folder chứa ảnh NFT



1. **`tests/utils/pinata.ts`** - IPFS Upload**Signature:**├── target/

   ```typescript

   uploadImageToPinata(filePath): Promise<string>  // Upload ảnh → trả về IPFS URL```rust│   └── idl/

   uploadMetadataToPinata(metadata): Promise<string>  // Upload JSON

   ```pub fn initialize(ctx: Context<Initialize>, max_supply: u64) -> Result<()>│       └── nft_minting.json       # Interface Definition

   - Retry logic: 3 lần, backoff 2s/4s/6s

   - Timeout: 60s cho ảnh, 30s cho metadata```├── .env                            # Pinata API keys



2. **`tests/utils/metadata.ts`** - NFT Metadata├── package.json

   ```typescript

   interface NFTAttributes {**Mục đích:** Khởi tạo NFT collection với max supply├── Anchor.toml

       origin: string;    // Xuất xứ

       age: string;       // Tuổi└── README.md

       weight: string;    // Cân nặng

       length: string;    // Độ dài**Accounts Required:**```

   }

   ```rust

   createNFTMetadata(name, description, imageUri, attributes)

   ```#[derive(Accounts)]## 🎯 Program Details



3. **`tests/utils/solana.ts`** - Blockchain Logicpub struct Initialize<'info> {

   ```typescript

   findCollectionPDA(): [PublicKey, number]  // Tìm PDA của collection    #[account(**Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`

   findMetadataPDA(mint): [PublicKey, number]  // PDA của metadata

   mintNFTOnChain(program, name, symbol, uri)  // Execute mint transaction        init,                           // Tạo account mới

   ```

        payer = authority,              // Authority trả phí**Collection PDA**: Tự động tạo từ seed `"nft_collection"`

**Scripts:**

        space = 8 + 32 + 8 + 8 + 1,    // Discriminator + Pubkey + 2xu64 + u8

- **`tests/mint-interactive.ts`** ⭐: CLI với prompts, hỗ trợ URL/file

- **`tests/mint-nft-simple.ts`**: Script automation đơn giản        seeds = [b"nft_collection"],    // PDA seed### Instructions



---        bump                            // Bump seed



## 💰 Chi phí    )]1. **initialize(max_supply)**: Khởi tạo collection



Mỗi NFT minted trên Devnet:    pub nft_collection: Account<'info, NftCollection>,2. **mint_nft(name, symbol, uri)**: Mint NFT mới

- **Rent**: ~0.0014 SOL (mint account + metadata)

- **Transaction fee**: ~0.00001 SOL    

- **Total**: ~0.0015 SOL/NFT

    #[account(mut)]## 📋 NFT Attributes

**Lưu ý**: Trên Mainnet chi phí có thể cao hơn do gas fees.

    pub authority: Signer<'info>,      // Người khởi tạo collection

---

    Mỗi NFT có 4 thuộc tính cố định:

## 🔍 Troubleshooting

    pub system_program: Program<'info, System>,

### Lỗi: "IPFS upload failed"

- **Nguyên nhân**: Network timeout hoặc API key sai}1. **Xuất xứ** (Origin) - Text

- **Giải pháp**: 

  - Kiểm tra `.env` có đúng API keys```2. **Tuổi** (Age) - Number  

  - Thử lại (script tự retry 3 lần)

  - Hoặc dùng URL ảnh thay vì upload file3. **Cân nặng** (Weight) - Number (kg)



### Lỗi: "Max supply reached"**Process Flow:**4. **Độ dài** (Length) - Number (cm)

- **Nguyên nhân**: Đã mint đủ 10,000 NFTs

- **Giải pháp**: Deploy program mới hoặc tăng `max_supply`1. Validate `authority` là signer

2. Tạo PDA account với seed `"nft_collection"`

### Lỗi: "Insufficient funds"3. Allocate space: 57 bytes total

- **Nguyên nhân**: Wallet không đủ SOL   - 8 bytes: Anchor discriminator

- **Giải pháp**: Airdrop thêm SOL trên Devnet   - 32 bytes: `authority` (Pubkey)

  ```bash   - 8 bytes: `total_minted` (u64)

  solana airdrop 2 <YOUR_WALLET_ADDRESS> --url devnet   - 8 bytes: `max_supply` (u64)

  ```   - 1 byte: `bump` (u8)

4. Initialize state:

---   ```rust

   nft_collection.authority = ctx.accounts.authority.key();

## 📚 Tài liệu tham khảo   nft_collection.total_minted = 0;

   nft_collection.max_supply = max_supply;

- [Anchor Framework](https://www.anchor-lang.com/)   nft_collection.bump = ctx.bumps.nft_collection;

- [Metaplex Token Metadata](https://docs.metaplex.com/programs/token-metadata/)   ```

- [Solana Cookbook](https://solanacookbook.com/)5. Log success message

- [Pinata IPFS](https://docs.pinata.cloud/)

**Security:**

---- ✅ PDA ensures deterministic address

- ✅ Only signer can initialize

## 📝 License- ✅ One-time initialization (init constraint)



MIT License---



## 👨‍💻 Author#### 2. **Mint NFT**



CuongTran17**Signature:**

```rust

---pub fn mint_nft(

    ctx: Context<MintNFT>,

**Program ID**: `44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9`      name: String,

**Network**: Solana Devnet      symbol: String,

**Collection**: 8/10,000 NFTs minted    uri: String,

) -> Result<()>
```

**Mục đích:** Mint một NFT mới với metadata

**Accounts Required:**
```rust
#[derive(Accounts)]
pub struct MintNFT<'info> {
    // 1. Collection state (mutable)
    #[account(
        mut,
        seeds = [b"nft_collection"],
        bump = nft_collection.bump
    )]
    pub nft_collection: Account<'info, NftCollection>,

    // 2. Mint account (khởi tạo)
    #[account(
        init,
        payer = payer,
        mint::decimals = 0,           // NFT = 0 decimals
        mint::authority = payer,      // Payer là mint authority
    )]
    pub mint: Account<'info, Mint>,

    // 3. Token account (sẽ được tạo bởi ATA program)
    /// CHECK: Will be created by ATA program
    #[account(mut)]
    pub token_account: UncheckedAccount<'info>,

    // 4. Metadata account (PDA của Metaplex)
    /// CHECK: PDA for metadata
    #[account(mut)]
    pub metadata: UncheckedAccount<'info>,

    // 5. Người trả phí và mint authority
    #[account(mut)]
    pub payer: Signer<'info>,

    // 6. Người nhận NFT
    /// CHECK: Token recipient
    pub recipient: UncheckedAccount<'info>,

    // 7. System accounts
    pub rent: Sysvar<'info, Rent>,
    pub system_program: Program<'info, System>,
    pub token_program: Program<'info, Token>,
    pub associated_token_program: Program<'info, AssociatedToken>,
}
```

**Process Flow:**

**Step 1: Validate Max Supply**
```rust
require!(
    nft_collection.total_minted < nft_collection.max_supply,
    NftError::MaxSupplyReached
);
```

**Step 2: Create Associated Token Account (ATA)**
```rust
let cpi_accounts = anchor_spl::associated_token::Create {
    payer: ctx.accounts.payer.to_account_info(),
    associated_token: ctx.accounts.token_account.to_account_info(),
    authority: ctx.accounts.recipient.to_account_info(),
    mint: ctx.accounts.mint.to_account_info(),
    system_program: ctx.accounts.system_program.to_account_info(),
    token_program: ctx.accounts.token_program.to_account_info(),
};
anchor_spl::associated_token::create(cpi_ctx)?;
```
- Tạo ATA cho recipient
- ATA address = derived từ (recipient, mint, token_program)

**Step 3: Mint 1 Token**
```rust
token::mint_to(
    CpiContext::new(
        ctx.accounts.token_program.to_account_info(),
        token::MintTo {
            mint: ctx.accounts.mint.to_account_info(),
            to: ctx.accounts.token_account.to_account_info(),
            authority: ctx.accounts.payer.to_account_info(),
        },
    ),
    1, // Mint exactly 1 token (NFT)
)?;
```

**Step 4: Create Metaplex Metadata**
```rust
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
        name,                          // NFT name
        symbol,                        // NFT symbol
        uri,                           // Metadata URI (IPFS)
        seller_fee_basis_points: 0,   // No royalty
        creators: None,                // No creators list
        collection: None,              // No collection parent
        uses: None,                    // No limited uses
    },
    is_mutable: true,                 // Metadata có thể update
    collection_details: None,
};

invoke(&ix, &[...accounts...])?;
```

**Step 5: Increment Counter**
```rust
nft_collection.total_minted += 1;
msg!("NFT minted successfully! Total: {}/{}", 
    nft_collection.total_minted, 
    nft_collection.max_supply
);
```

**Security Checks:**
- ✅ Collection must exist (PDA validation)
- ✅ Max supply not exceeded
- ✅ Payer must be signer
- ✅ Mint account must be fresh (init)
- ✅ Atomic transaction (all-or-nothing)

---

### State Management

#### **NftCollection State**

```rust
#[account]
pub struct NftCollection {
    pub authority: Pubkey,      // 32 bytes - Collection owner
    pub total_minted: u64,      // 8 bytes - Counter
    pub max_supply: u64,        // 8 bytes - Maximum NFTs
    pub bump: u8,               // 1 byte - PDA bump seed
}
// Total: 49 bytes + 8 bytes discriminator = 57 bytes
```

**Fields:**
- `authority`: Người tạo collection (không dùng trong logic hiện tại, có thể dùng cho future features)
- `total_minted`: Số NFT đã mint (counter tự động tăng)
- `max_supply`: Giới hạn số NFT (set lúc initialize)
- `bump`: Bump seed của PDA (để derive lại address)

**Lifetime:**
- Tạo: Khi gọi `initialize()`
- Update: Mỗi lần `mint_nft()` thành công
- Delete: Không có instruction để delete (permanent)

---

### Account Validation

#### **PDA (Program Derived Address) Validation**

**Collection PDA:**
```rust
seeds = [b"nft_collection"]
bump = nft_collection.bump
```

**Derivation:**
```typescript
const [collectionPDA, bump] = PublicKey.findProgramAddressSync(
    [Buffer.from("nft_collection")],
    PROGRAM_ID
);
```

**Properties:**
- Deterministic: Luôn ra cùng address với cùng seed
- No private key: Chỉ program mới sign được
- Unique: Mỗi program có PDA riêng

**Metadata PDA (Metaplex):**
```typescript
const [metadataPDA] = PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mintPubkey.toBuffer(),
    ],
    METADATA_PROGRAM_ID
);
```

**Security Benefits:**
- ✅ Không cần lưu address (derive on-demand)
- ✅ Không thể fake (chỉ program tạo được)
- ✅ Cross-program invocation (CPI) an toàn

---

### Error Handling

```rust
#[error_code]
pub enum NftError {
    #[msg("Maximum supply of NFTs has been reached")]
    MaxSupplyReached,
}
```

**Usage:**
```rust
require!(
    nft_collection.total_minted < nft_collection.max_supply,
    NftError::MaxSupplyReached
);
```

**Error Code:** `0x1770` (6000 in decimal, Anchor custom error base)

**Client Handling:**
```typescript
try {
    await program.methods.mintNft(...).rpc();
} catch (err) {
    if (err.code === 6000) {
        console.error("Collection sold out!");
    }
}
```

---

## III. TypeScript Client

### Architecture

```
tests/
├── mint-interactive.ts      # Interactive CLI (main)
├── mint-nft-simple.ts       # Automation script
└── utils/
    ├── pinata.ts           # IPFS upload + retry logic
    ├── metadata.ts         # NFT metadata builder
    └── solana.ts           # Blockchain helpers
```

**Design Pattern:** Modular architecture với reusable utilities

---

### Utility Modules

#### 1. **`pinata.ts` - IPFS Upload Service**

**Responsibilities:**
- Upload ảnh lên IPFS qua Pinata API
- Upload JSON metadata lên IPFS
- Retry logic cho network resilience

**Key Functions:**

##### `uploadImageToPinata(imagePath: string, retries = 3): Promise<string>`

**Purpose:** Upload image file to IPFS with retry mechanism

**Process:**
```typescript
for (let attempt = 1; attempt <= retries; attempt++) {
    try {
        // 1. Validate file exists
        if (!fs.existsSync(imagePath)) {
            throw new Error(`File not found: ${imagePath}`);
        }

        // 2. Create FormData with file stream
        const formData = new FormData();
        formData.append("file", fs.createReadStream(imagePath));
        formData.append("pinataMetadata", JSON.stringify({
            name: `NFT Image ${Date.now()}`
        }));

        // 3. POST to Pinata API
        const response = await axios.post(
            "https://api.pinata.cloud/pinning/pinFileToIPFS",
            formData,
            {
                headers: {
                    "Content-Type": `multipart/form-data`,
                    pinata_api_key: PINATA_API_KEY,
                    pinata_secret_api_key: PINATA_SECRET_KEY,
                },
                timeout: 60000, // 60s timeout for large files
            }
        );

        // 4. Return IPFS gateway URL
        return `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
        
    } catch (error) {
        // 5. Retry logic
        if (attempt < retries) {
            await sleep(attempt * 2000); // Exponential backoff: 2s, 4s, 6s
        } else {
            throw error;
        }
    }
}
```

**Features:**
- ✅ Retry: 3 attempts mặc định
- ✅ Exponential backoff: 2s → 4s → 6s
- ✅ Timeout: 60s cho ảnh lớn
- ✅ Error logging: Chi tiết từng attempt

**Example Output:**
```
📤 Uploading image to IPFS... (Attempt 1/3)
✅ Image uploaded successfully!
🔗 Image URL: https://gateway.pinata.cloud/ipfs/QmXxx...
```

##### `uploadMetadataToPinata(metadata: any, retries = 3): Promise<string>`

**Purpose:** Upload JSON metadata to IPFS

**Process:**
```typescript
const response = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,  // Direct JSON object
    {
        headers: {
            "Content-Type": "application/json",
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
        },
        timeout: 30000, // 30s timeout (JSON is smaller)
    }
);
```

**Differences from image upload:**
- Direct JSON post (không cần FormData)
- Timeout ngắn hơn (30s vs 60s)
- Không cần file stream

**Retry Strategy:**
- Same exponential backoff
- Handles `ECONNRESET`, `ETIMEDOUT`, `ENOTFOUND`
- Logs mỗi attempt để debug

---

#### 2. **`metadata.ts` - NFT Metadata Builder**

**Responsibilities:**
- Define NFT metadata structure
- Build compliant JSON for Metaplex standard
- Type safety với TypeScript interfaces

**Interfaces:**

```typescript
export interface NFTAttributes {
    origin: string;    // Xuất xứ
    age: number;       // Tuổi
    weight: number;    // Cân nặng (kg)
    length: number;    // Độ dài (cm)
}

export interface NFTMetadata {
    name: string;
    symbol: string;
    description: string;
    image: string;                    // IPFS URL
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
```

**Key Function:**

##### `createNFTMetadata(...): NFTMetadata`

**Purpose:** Tạo JSON metadata theo chuẩn Metaplex

**Signature:**
```typescript
export function createNFTMetadata(
    name: string,
    symbol: string,
    description: string,
    imageUrl: string,
    attributes: NFTAttributes
): NFTMetadata
```

**Output Structure:**
```json
{
    "name": "Dragon Warrior #1",
    "symbol": "DRAGON",
    "description": "A legendary dragon warrior",
    "image": "https://gateway.pinata.cloud/ipfs/QmXxx...",
    "attributes": [
        { "trait_type": "Xuất xứ", "value": "Ancient Mountains" },
        { "trait_type": "Tuổi", "value": 500 },
        { "trait_type": "Cân nặng (kg)", "value": 1200 },
        { "trait_type": "Độ dài (cm)", "value": 3000 }
    ],
    "properties": {
        "files": [
            {
                "uri": "https://gateway.pinata.cloud/ipfs/QmXxx...",
                "type": "image/png"
            }
        ],
        "category": "image"
    }
}
```

**Compliance:**
- ✅ OpenSea compatible
- ✅ Metaplex standard
- ✅ Solana NFT metadata v1.0.0

**Benefits:**
- Type-safe attributes
- Consistent structure
- Reusable across scripts

---

#### 3. **`solana.ts` - Blockchain Helpers**

**Responsibilities:**
- Constants (Program IDs, PDAs)
- PDA derivation functions
- On-chain transaction helpers

**Constants:**
```typescript
export const METADATA_PROGRAM_ID = new PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"  // Metaplex
);

export const PROGRAM_ID = new PublicKey(
    "44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9"  // Our program
);
```

**PDA Functions:**

##### `findCollectionPDA(programId: PublicKey): [PublicKey, number]`

```typescript
return PublicKey.findProgramAddressSync(
    [Buffer.from("collection")],
    programId
);
```

**Returns:** `[PDA address, bump seed]`

##### `findMetadataPDA(mint: PublicKey): [PublicKey, number]`

```typescript
return PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
    ],
    METADATA_PROGRAM_ID
);
```

**Purpose:** Derive Metaplex metadata account address

##### `findMasterEditionPDA(mint: PublicKey): [PublicKey, number]`

```typescript
return PublicKey.findProgramAddressSync(
    [
        Buffer.from("metadata"),
        METADATA_PROGRAM_ID.toBuffer(),
        mint.toBuffer(),
        Buffer.from("edition"),
    ],
    METADATA_PROGRAM_ID
);
```

**Purpose:** Derive master edition account (for NFT uniqueness)

**Key Function:**

##### `mintNFTOnChain(...): Promise<string>`

**Purpose:** Execute on-chain mint transaction

**Full Signature:**
```typescript
export async function mintNFTOnChain(
    program: anchor.Program,
    payer: Keypair,
    name: string,
    symbol: string,
    uri: string
): Promise<string>
```

**Process:**
```typescript
// 1. Generate new mint keypair
const mintKeypair = Keypair.generate();

// 2. Derive all PDAs
const [collectionPda] = findCollectionPDA(program.programId);
const [metadataPda] = findMetadataPDA(mintKeypair.publicKey);
const [masterEditionPda] = findMasterEditionPDA(mintKeypair.publicKey);

// 3. Calculate ATA address
const tokenAccount = await getAssociatedTokenAddress(
    mintKeypair.publicKey,
    payer.publicKey
);

// 4. Build and send transaction
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
    .signers([mintKeypair])  // Mint keypair signs
    .rpc();

// 5. Return mint address
return mintKeypair.publicKey.toString();
```

**Returns:** Mint address (NFT address)

**Transaction Explorer:**
```
https://explorer.solana.com/tx/${tx}?cluster=devnet
```

---

### Scripts

#### 1. **`mint-interactive.ts` - Interactive CLI**

**Purpose:** User-friendly CLI cho người dùng mint NFT

**Features:**
- ✅ Step-by-step prompts
- ✅ Input validation
- ✅ Support URL ảnh HOẶC file local
- ✅ Real-time feedback
- ✅ Confirmation step

**Flow:**

**Step 1: Image Input**
```typescript
const imageResponse = await prompts({
    type: 'text',
    name: 'imageInput',
    message: '🖼️  Nhập URL ảnh HOẶC đường dẫn file ảnh:',
    validate: value => {
        // Nếu là URL
        if (value.startsWith('http://') || value.startsWith('https://')) {
            try {
                new URL(value);
                return true;
            } catch {
                return 'URL không hợp lệ';
            }
        }
        
        // Nếu là file path
        if (!fs.existsSync(value)) {
            return `File không tồn tại: ${value}`;
        }
        const ext = path.extname(value).toLowerCase();
        if (!['.png', '.jpg', '.jpeg', '.gif', '.webp'].includes(ext)) {
            return 'File phải là ảnh';
        }
        return true;
    }
});
```

**Smart Image Handling:**
```typescript
let imageUrl: string;

if (imageInput.startsWith('http://') || imageInput.startsWith('https://')) {
    // Dùng URL trực tiếp (nhanh, không upload)
    imageUrl = imageInput;
    console.log("🔗 Using image URL:", imageUrl);
} else {
    // Upload file lên IPFS (cần Pinata API)
    imageUrl = await uploadImageToPinata(imageInput);
}
```

**Step 2: NFT Basic Info**
```typescript
const basicInfo = await prompts([
    {
        type: 'text',
        name: 'name',
        message: '🏷️  Tên NFT:',
        validate: value => value.length > 0 ? true : 'Tên không được để trống'
    },
    {
        type: 'text',
        name: 'symbol',
        message: '🔤 Symbol (ký hiệu):',
        validate: value => value.length > 0 && value.length <= 10 
            ? true 
            : 'Symbol phải từ 1-10 ký tự'
    },
    {
        type: 'text',
        name: 'description',
        message: '📝 Mô tả NFT:',
    }
]);
```

**Step 3: Fixed Attributes (4 fields)**
```typescript
const attributesInput = await prompts([
    {
        type: 'text',
        name: 'origin',
        message: '🌍 Xuất xứ (Origin):',
        validate: value => value.length > 0 ? true : 'Xuất xứ không được để trống'
    },
    {
        type: 'number',
        name: 'age',
        message: '📅 Tuổi (Age):',
        validate: value => value >= 0 ? true : 'Tuổi phải >= 0'
    },
    {
        type: 'number',
        name: 'weight',
        message: '⚖️  Cân nặng/kg (Weight):',
        validate: value => value > 0 ? true : 'Cân nặng phải > 0'
    },
    {
        type: 'number',
        name: 'length',
        message: '📏 Độ dài/cm (Length):',
        validate: value => value > 0 ? true : 'Độ dài phải > 0'
    }
]);
```

**Step 4: Confirmation**
```typescript
console.log("📋 XÁC NHẬN THÔNG TIN NFT:");
console.log("🖼️  Ảnh:", imageInput);
console.log("🏷️  Tên:", basicInfo.name);
console.log("🔤 Symbol:", basicInfo.symbol);
console.log("📝 Mô tả:", basicInfo.description);
console.log("\n📋 Attributes:");
console.log(`   1. Xuất xứ: ${attributes.origin}`);
console.log(`   2. Tuổi: ${attributes.age}`);
console.log(`   3. Cân nặng: ${attributes.weight} kg`);
console.log(`   4. Độ dài: ${attributes.length} cm`);

const confirm = await prompts({
    type: 'confirm',
    name: 'proceed',
    message: '✅ Xác nhận mint NFT này?',
});
```

**Step 5: Mint Process**
```typescript
try {
    // 1. Upload metadata to IPFS
    const metadata = createNFTMetadata(
        basicInfo.name,
        basicInfo.symbol,
        basicInfo.description,
        imageUrl,
        attributes
    );
    const metadataUri = await uploadMetadataToPinata(metadata);

    // 2. Mint on-chain
    const mintAddress = await mintNFTOnChain(
        program,
        payer,
        basicInfo.name,
        basicInfo.symbol,
        metadataUri
    );

    // 3. Display results
    console.log("🎉 SUCCESS! NFT MINTED!");
    console.log(`✅ NFT Address: ${mintAddress}`);
    console.log(`🖼️  Image: ${imageUrl}`);
    console.log(`📄 Metadata: ${metadataUri}`);
} catch (error) {
    console.error("❌ Error:", error.message);
}
```

**Usage:**
```bash
npm run mint:interactive
```

---

#### 2. **`mint-nft-simple.ts` - Automation Script**

**Purpose:** Script tự động với config hardcoded

**Use Cases:**
- Batch minting nhiều NFTs
- Testing & development
- CI/CD integration
- Scripted workflows

**Key Differences:**
- Không có prompts (silent mode)
- Config trong code (không nhập từ user)
- Phù hợp cho loops:

```typescript
// Example: Mint 100 NFTs
for (let i = 1; i <= 100; i++) {
    const config = {
        name: `Dragon #${i}`,
        symbol: "DRAGON",
        imagePath: `./images/dragon-${i}.png`,
        attributes: {
            origin: "Ancient Mountains",
            age: 500 + i,
            weight: 1200,
            length: 3000
        }
    };
    
    await mintNFT(config);
}
```

**Usage:**
```bash
npm run mint
```

---

## IV. Technical Flow

### Complete Mint Flow (End-to-End)

```
┌─────────────────────────────────────────────────────────────────┐
│                        USER INPUT                                │
│  - Image (URL or file path)                                     │
│  - NFT info (name, symbol, description)                         │
│  - Attributes (origin, age, weight, length)                     │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VALIDATE INPUT                                │
│  ✓ URL format OR file exists                                    │
│  ✓ Name/symbol not empty                                        │
│  ✓ Attributes are numbers                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  IMAGE HANDLING                                  │
│  ┌──────────────────┐                ┌──────────────────┐       │
│  │   URL Input?     │──Yes──────────▶│  Use directly    │       │
│  └──────┬───────────┘                └──────────────────┘       │
│         │No                                                      │
│         ▼                                                        │
│  ┌──────────────────┐                                           │
│  │  Upload to IPFS  │◀────────────────────────────────┐         │
│  │  (Pinata API)    │                                 │         │
│  └──────┬───────────┘                                 │         │
│         │Success                           Retry      │         │
│         ├────────────────────────┬──────────(3x)──────┘         │
│         │                        │Error                         │
│         ▼                        ▼                              │
│  imageUrl = IPFS URL      Throw Error                           │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                  CREATE METADATA JSON                            │
│  {                                                               │
│    name, symbol, description,                                   │
│    image: imageUrl,                                             │
│    attributes: [                                                │
│      {trait_type: "Xuất xứ", value: "..."},                    │
│      {trait_type: "Tuổi", value: 500},                         │
│      ...                                                        │
│    ],                                                           │
│    properties: {...}                                            │
│  }                                                              │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              UPLOAD METADATA TO IPFS                             │
│  POST to Pinata API                                             │
│  ┌────────────────┐                                             │
│  │  Success?      │──Yes──▶ metadataUri = IPFS URL             │
│  └───────┬────────┘                                             │
│          │No                                                    │
│          ▼                                                      │
│  ┌────────────────┐                                             │
│  │  Retry (3x)    │                                             │
│  └────────────────┘                                             │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              PREPARE BLOCKCHAIN TRANSACTION                      │
│  1. Generate mint keypair                                       │
│  2. Derive PDAs:                                                │
│     - Collection PDA (seed: "nft_collection")                   │
│     - Metadata PDA (Metaplex)                                   │
│     - Master Edition PDA                                        │
│  3. Calculate ATA address                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                 SEND TRANSACTION TO SOLANA                       │
│  program.methods.mintNft(name, symbol, metadataUri)            │
│    .accounts({...all required accounts...})                     │
│    .signers([mintKeypair])                                      │
│    .rpc()                                                       │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│              ON-CHAIN EXECUTION (SMART CONTRACT)                 │
│  1. Validate max supply                                         │
│  2. Create ATA (CPI to Associated Token Program)                │
│  3. Mint 1 token (CPI to Token Program)                         │
│  4. Create metadata (CPI to Metaplex)                           │
│  5. Increment total_minted counter                              │
│  6. Emit success log                                            │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    TRANSACTION CONFIRMED                         │
│  ✅ NFT Minted!                                                 │
│  📦 Mint Address: Xxx...                                        │
│  🔗 TX: https://explorer.solana.com/tx/...                      │
│  🖼️  Image: https://gateway.pinata.cloud/ipfs/...              │
│  📄 Metadata: https://gateway.pinata.cloud/ipfs/...             │
└─────────────────────────────────────────────────────────────────┘
```

### Account Relationships

```
                        ┌──────────────────┐
                        │  System Program  │
                        └────────┬─────────┘
                                 │ owns
                                 ▼
                        ┌──────────────────┐
                        │ Collection PDA   │
                        │ ───────────────  │
                        │ authority        │
                        │ total_minted     │◀────── Owned by Program
                        │ max_supply       │
                        │ bump             │
                        └──────────────────┘

┌──────────────┐        ┌──────────────────┐
│ Payer        │────────│ Mint Account     │
│ (Signer)     │ pays   │ ──────────────── │
└──────────────┘        │ decimals: 0      │
                        │ supply: 1        │
                        │ mint_auth: payer │
                        └─────────┬────────┘
                                  │
                   ┌──────────────┼──────────────┐
                   │              │              │
                   ▼              ▼              ▼
         ┌─────────────┐  ┌──────────────┐  ┌──────────────┐
         │ Token       │  │ Metadata     │  │ Master       │
         │ Account     │  │ Account      │  │ Edition      │
         │ ─────────── │  │ ──────────── │  │ ──────────── │
         │ owner       │  │ name         │  │ supply: 0    │
         │ amount: 1   │  │ symbol       │  │ max_supply:0 │
         └─────────────┘  │ uri          │  └──────────────┘
                          │ creators     │
                          └──────────────┘
```

**Ownership Chain:**
1. System Program owns Collection PDA
2. Payer owns Mint Account (mint authority)
3. Token Program owns Token Account
4. Metaplex Program owns Metadata & Master Edition
5. Recipient owns the Token (NFT holder)

---

## V. Installation & Usage

### Prerequisites

```bash
# Solana CLI
sh -c "$(curl -sSfL https://release.solana.com/stable/install)"
solana --version  # >= 1.18.0

# Anchor CLI
cargo install --git https://github.com/coral-xyz/anchor avm --locked --force
avm install 0.29.0
avm use 0.29.0
anchor --version  # 0.29.0

# Node.js & npm
node --version   # >= 18.0.0
npm --version    # >= 9.0.0
```

### Setup

**1. Clone & Install**
```bash
git clone https://github.com/CuongTran17/solana-nft-minting.git
cd solana-nft-minting
npm install
```

**2. Configure Solana**
```bash
# Set to devnet
solana config set --url devnet

# Generate keypair (nếu chưa có)
solana-keygen new

# Request airdrop (devnet SOL)
solana airdrop 2
solana balance
```

**3. Setup Pinata (Optional - chỉ cần nếu upload file)**
```bash
# Tạo file .env
cp .env.example .env

# Edit .env
PINATA_API_KEY=your_api_key_here
PINATA_SECRET_KEY=your_secret_key_here
```

Lấy API keys tại: https://app.pinata.cloud/

### Build & Deploy

```bash
# Build program
anchor build

# Deploy to devnet
anchor deploy
```

**Output:**
```
Program Id: 44mKazm9XGzWedW2x3KGXmRMAGkbU15pFNVKokL6ERg9
```

### Mint NFT

**Interactive Mode (Recommended):**
```bash
npm run mint:interactive
```

**Automation Mode:**
```bash
npm run mint
```

---

## VI. Advanced Topics

### Cost Breakdown

**Transaction Costs (Devnet/Mainnet similar):**

| Action | Cost | Account | Note |
|--------|------|---------|------|
| Initialize Collection | ~0.002 SOL | 57 bytes | One-time |
| Mint NFT | ~0.015 SOL | Multiple accounts | Per NFT |
| - Mint account | ~0.001428 SOL | 82 bytes | Rent-exempt |
| - Token account | ~0.002039 SOL | 165 bytes | ATA |
| - Metadata account | ~0.005616 SOL | ~679 bytes | Metaplex |
| - Master Edition | ~0.002853 SOL | 282 bytes | Unique NFT |
| - Transaction fee | ~0.000005 SOL | - | Network fee |

**Total per NFT:** ~0.015-0.02 SOL

### Security Best Practices

**Smart Contract:**
1. ✅ Use PDAs (không cần private keys)
2. ✅ Validate all accounts (Anchor macros)
3. ✅ Check max supply before mint
4. ✅ Atomic transactions (all-or-nothing)
5. ✅ No reentrancy (Solana model)

**Client:**
1. ✅ Never commit private keys
2. ✅ Use environment variables (.env)
3. ✅ Validate user input
4. ✅ Handle errors gracefully
5. ✅ Retry logic for network issues

**IPFS:**
1. ✅ Pin metadata on IPFS (permanent)
2. ✅ Use gateways with CDN
3. ✅ Backup metadata locally
4. ✅ Consider Arweave for critical data

### Troubleshooting

**Common Errors:**

**1. "Account not found"**
```
Cause: Collection chưa được initialize
Fix: Run initialize() trước khi mint
```

**2. "MaxSupplyReached"**
```
Cause: Đã mint đủ 10,000 NFTs
Fix: Không thể mint thêm, collection sold out
```

**3. "ECONNRESET" (Pinata)**
```
Cause: Network timeout
Fix: Retry logic tự động xử lý (3 attempts)
```

**4. "Insufficient funds"**
```
Cause: Không đủ SOL để trả phí
Fix: solana airdrop 2 (devnet)
```

**5. "Invalid metadata URI"**
```
Cause: URI không phải HTTPS hoặc quá dài
Fix: Check IPFS URL format
```

### Performance Tips

**Batch Minting:**
```typescript
// Mint 100 NFTs with delay
for (let i = 0; i < 100; i++) {
    await mintNFT(config);
    await sleep(1000); // 1s delay để tránh rate limit
}
```

**Parallel Uploads (IPFS):**
```typescript
// Upload nhiều ảnh cùng lúc
const uploads = images.map(img => uploadImageToPinata(img));
const urls = await Promise.all(uploads);
```

**Transaction Confirmation:**
```typescript
// Wait for confirmed (không chỉ processed)
const tx = await program.methods
    .mintNft(...)
    .rpc({ commitment: 'confirmed' });
```

### Extending the Program

**Add Creator Royalties:**
```rust
creators: Some(vec![
    Creator {
        address: payer.key(),
        verified: true,
        share: 100, // 100%
    }
]),
seller_fee_basis_points: 500, // 5% royalty
```

**Add Collection Parent:**
```rust
collection: Some(Collection {
    verified: false,
    key: collection_mint.key(),
}),
```

**Add Update Authority:**
```rust
// Allow updating metadata later
is_mutable: true,
update_authority: payer.key(),
```

### Testing

**Unit Tests:**
```bash
anchor test
```

**Integration Test Example:**
```typescript
it("Mints NFT successfully", async () => {
    const tx = await program.methods
        .mintNft("Test NFT", "TEST", "https://example.com/metadata.json")
        .accounts({...})
        .rpc();
    
    const collection = await program.account.nftCollection.fetch(collectionPDA);
    assert.equal(collection.totalMinted.toNumber(), 1);
});
```

---

## 📚 References

### Official Documentation
- [Solana Docs](https://docs.solana.com/)
- [Anchor Book](https://book.anchor-lang.com/)
- [Metaplex Docs](https://docs.metaplex.com/)
- [Solana Cookbook](https://solanacookbook.com/)

### Standards
- [Metaplex Token Metadata Standard](https://docs.metaplex.com/programs/token-metadata/)
- [OpenSea Metadata Standards](https://docs.opensea.io/docs/metadata-standards)

### Tools
- [Solana Explorer](https://explorer.solana.com/)
- [Solana CLI Reference](https://docs.solana.com/cli)
- [Anchor CLI Reference](https://www.anchor-lang.com/docs/cli)

---

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request

---

## 📄 License

MIT License - See LICENSE file

---

## 👤 Author

**CuongTran17**
- GitHub: [@CuongTran17](https://github.com/CuongTran17)
- Repository: [solana-nft-minting](https://github.com/CuongTran17/solana-nft-minting)

---

**Last Updated:** October 19, 2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
