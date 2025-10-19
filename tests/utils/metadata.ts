export interface NFTAttributes {
  origin: string;
  age: number;
  weight: number;
  length: number;
}

export interface NFTMetadata {
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
 * Tạo metadata cho NFT
 */
export function createNFTMetadata(
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
        trait_type: "Xuất xứ",
        value: attributes.origin,
      },
      {
        trait_type: "Tuổi",
        value: attributes.age,
      },
      {
        trait_type: "Cân nặng (kg)",
        value: attributes.weight,
      },
      {
        trait_type: "Độ dài (cm)",
        value: attributes.length,
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
