import { Collection } from 'mongodb';
import db from '../utils/db';

export type RawNFT = {
  id: number;
  image: string;
  attributes: {
    trait_type?: string;
    value?: string;
  }[];
};

export type NFT = {
  index: number;
  image: string;
  attributes: {
    traitType: string;
    value: string;
    percentile: number;
    rarityScore: number;
    count: number;
  }[];
  missingTraits: {
    traitType: string;
    rarityScore: number;
    count: number;
    percentile: number;
  }[];
  traitCount: number;
  percentile: number;
  rarityScore: number;
};

export async function collection(): Promise<Collection> {
  return db('collection');
}

export async function nft(slug: string): Promise<Collection> {
  return db(`nft:${slug}`);
}
