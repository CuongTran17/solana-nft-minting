# Hướng dẫn lấy Pinata API Keys

## Bước 1: Đăng ký Pinata

1. Vào https://www.pinata.cloud/
2. Click "Sign Up" (góc trên bên phải)
3. Đăng ký bằng email hoặc Google
4. Xác nhận email

## Bước 2: Tạo API Key

1. Đăng nhập vào Pinata
2. Click vào biểu tượng người dùng → **API Keys**
3. Click nút **"+ New Key"**
4. Cấu hình quyền:
   - ✅ Bật "Admin" (hoặc chọn cụ thể):
     - ✅ `pinFileToIPFS`
     - ✅ `pinJSONToIPFS`
   - Đặt tên: "NFT Minting"
5. Click **"Generate Key"**

## Bước 3: Copy API Keys

Pinata sẽ hiển thị:
- **API Key**: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- **API Secret**: abc123def456...

⚠️ **Chú ý**: API Secret chỉ hiển thị 1 lần duy nhất! Lưu ngay!

## Bước 4: Cập nhật .env

Mở file `.env` và thay thế:

```env
PINATA_API_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...  # API Key của bạn
PINATA_SECRET_KEY=abc123def456...                        # API Secret của bạn
```

## Bước 5: Thêm ảnh NFT

```bash
# Copy ảnh của bạn vào folder tests/images/
cp /path/to/your/image.png tests/images/nft.png
```

## Bước 6: Chạy mint

```bash
npm run mint
```

---

## Plan miễn phí Pinata

✅ 1 GB storage
✅ Unlimited uploads
✅ Đủ cho hàng nghìn NFT

## Troubleshooting

**Lỗi: "Invalid API Key"**
- Kiểm tra lại API Key có copy đầy đủ không
- Đảm bảo không có khoảng trắng thừa

**Lỗi: "File not found"**
- Kiểm tra đường dẫn ảnh trong script
- Đảm bảo file ảnh tồn tại

**Lỗi: "Unauthorized"**
- API Secret sai hoặc thiếu quyền
- Tạo lại API Key với quyền đầy đủ
