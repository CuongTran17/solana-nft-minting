import fs from "fs";
import FormData from "form-data";
import axios from "axios";

const PINATA_API_KEY = process.env.PINATA_API_KEY || "";
const PINATA_SECRET_KEY = process.env.PINATA_SECRET_KEY || "";

/**
 * Sleep helper function
 */
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Upload hình ảnh lên Pinata (IPFS) với retry logic
 */
export async function uploadImageToPinata(
  imagePath: string,
  retries = 3
): Promise<string> {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`\n📤 Uploading image to IPFS... (Attempt ${attempt}/${retries})`);

      if (!fs.existsSync(imagePath)) {
        throw new Error(`File not found: ${imagePath}`);
      }

      const formData = new FormData();
      formData.append("file", fs.createReadStream(imagePath));

      const pinataMetadata = JSON.stringify({
        name: `NFT Image ${Date.now()}`,
      });
      formData.append("pinataMetadata", pinataMetadata);

      const response = await axios.post(
        "https://api.pinata.cloud/pinning/pinFileToIPFS",
        formData,
        {
          maxBodyLength: Infinity,
          headers: {
            "Content-Type": `multipart/form-data; boundary=${formData.getBoundary()}`,
            pinata_api_key: PINATA_API_KEY,
            pinata_secret_api_key: PINATA_SECRET_KEY,
          },
          timeout: 60000, // 60 second timeout
        }
      );

      const imageUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ Image uploaded successfully!");
      console.log(`🔗 Image URL: ${imageUrl}`);
      return imageUrl;
    } catch (error: any) {
      console.error(
        `❌ Error uploading image (Attempt ${attempt}/${retries}):`,
        error.message
      );
      if (attempt < retries) {
        const waitTime = attempt * 2;
        console.log(`⏳ Retrying in ${waitTime} seconds...`);
        await sleep(waitTime * 1000);
      } else {
        throw new Error(`Failed to upload image after ${retries} attempts: ${error.message}`);
      }
    }
  }
  throw new Error("Failed to upload image");
}

/**
 * Upload metadata lên Pinata (IPFS) với retry logic
 */
export async function uploadMetadataToPinata(
  metadata: any,
  retries = 3
): Promise<string> {
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
          timeout: 30000, // 30 second timeout
        }
      );

      const metadataUrl = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log("✅ Metadata uploaded successfully!");
      console.log(`🔗 Metadata URL: ${metadataUrl}`);
      return metadataUrl;
    } catch (error: any) {
      console.error(
        `❌ Error uploading metadata (Attempt ${attempt}/${retries}):`,
        error.message
      );
      if (attempt < retries) {
        const waitTime = attempt * 2;
        console.log(`⏳ Retrying in ${waitTime} seconds...`);
        await sleep(waitTime * 1000);
      } else {
        throw new Error(`Failed to upload metadata after ${retries} attempts: ${error.message}`);
      }
    }
  }
  throw new Error("Failed to upload metadata");
}
