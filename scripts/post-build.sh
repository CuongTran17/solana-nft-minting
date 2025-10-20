#!/bin/bash
# Post-build hook to copy .so file to correct location

echo "📦 Copying built program to target/deploy..."

mkdir -p target/deploy

# Copy .so file
if [ -f "programs/nft-minting/target/deploy/nft_minting.so" ]; then
    cp programs/nft-minting/target/deploy/nft_minting.so target/deploy/
    echo "✅ Copied nft_minting.so"
else
    echo "❌ Warning: nft_minting.so not found in programs/nft-minting/target/deploy/"
fi

# Copy keypair if needed
if [ -f "programs/nft-minting/target/deploy/nft_minting-keypair.json" ]; then
    if [ ! -f "target/deploy/nft_minting-keypair.json" ]; then
        cp programs/nft-minting/target/deploy/nft_minting-keypair.json target/deploy/
        echo "✅ Copied keypair"
    fi
fi

echo "✅ Post-build complete"
