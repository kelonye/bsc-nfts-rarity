import orderBy from 'lodash/orderBy';

import { COLLECTIONS } from '../config';
import * as redis from '../utils/redis';
import { getRedisNFTKey, getRedisSortedNFTsKey } from '../nfts/utils';

type RawNFT = {
  id: number;
  image: string;
  attributes: {
    trait_type?: string;
    value?: string;
  }[];
};

type NFT = {
  id: number;
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

async function main(slug: string) {
  const { count } = COLLECTIONS[slug];

  const jobs: any = [];
  for (let i = 1; i <= count; i++) {
    jobs.push(redis.exec('get', [getRedisNFTKey(slug, i)]));
  }
  const data: string[] = await Promise.all(jobs);

  const nfts = data
    .map((s, id) => {
      if (s) {
        const nft = JSON.parse(s);
        if (nft) {
          nft.id ??= id;
          return nft;
        }
      }
      return null;
    })
    .filter((n) => !!n?.attributes);

  const sortedNFTs = await rateNFTs(nfts);

  for (let k = 0; k < sortedNFTs.length; k++) {
    const nft = sortedNFTs[k];
    await redis.exec('zadd', [getRedisSortedNFTsKey(slug), k + 1, nft.id]);
  }
}

async function rateNFTs(punks: RawNFT[]) {
  const allTraits = {};
  const attrCount = {};

  // normalize
  let sortedNFTs: NFT[] = punks.map((nft) => {
    const { id, image } = nft;

    const attributes = nft.attributes
      .filter((attr) => attr.trait_type && attr.value)
      .map((attr) => ({
        traitType: attr.trait_type!,
        value: attr.value!,
        percentile: 0,
        count: 0,
        rarityScore: 0,
      }));

    return {
      id,
      image,
      attributes,
      missingTraits: [],
      traitCount: 0,
      percentile: 0,
      rarityScore: 0,
    };
  });

  // aggregate all attrs
  let totalTraits = 0;
  sortedNFTs.forEach(({ attributes }) => {
    if (attrCount[attributes.length]) {
      attrCount[attributes.length] = attrCount[attributes.length] + 1;
    } else {
      attrCount[attributes.length] = 1;
    }
    attributes.forEach(({ traitType, value }) => {
      totalTraits += 1;
      if (allTraits[traitType]) {
        // trait exists
        allTraits[traitType].sum++;
        if (allTraits[traitType][value]) {
          // trait exists, value exists
          allTraits[traitType][value]++;
        } else {
          // trait exists, value doesn't
          allTraits[traitType][value] = 1;
        }
      } else {
        // trait or value don't exist
        allTraits[traitType] = { [value]: 1, sum: 1 };
      }
    });
  });

  //
  sortedNFTs.forEach((nft) => {
    let missingTraits = Object.keys(allTraits);

    nft.attributes.forEach((attribute) => {
      // remove traits that are present
      missingTraits = missingTraits.filter(
        (trait) => trait !== attribute.traitType
      );
      //
      attribute.count = allTraits[attribute.traitType][attribute.value];
      attribute.percentile = attribute.count / totalTraits;
      attribute.rarityScore = 1 / (attribute.count / totalTraits);
    });

    // set missing traits
    missingTraits.forEach((missingTrait) => {
      const rarityCount = allTraits[missingTrait].sum;
      const missingCount = totalTraits - rarityCount;
      const percentile = missingCount / totalTraits;
      const rarityScore = 1 / percentile;

      nft.missingTraits.push({
        traitType: missingTrait,
        rarityScore,
        count: missingCount,
        percentile,
      });
    });

    // rarity score
    nft.traitCount = nft.attributes.length;
    nft.percentile = attrCount[nft.attributes.length] / totalTraits;
    nft.rarityScore = 1 / (attrCount[nft.attributes.length] / totalTraits);

    nft.attributes.forEach((attribute) => {
      nft.rarityScore += attribute.rarityScore;
    });
    nft.missingTraits.forEach((trait) => {
      nft.rarityScore += trait.rarityScore;
    });
    nft.rarityScore += nft.rarityScore;
  });

  sortedNFTs = orderBy(sortedNFTs, 'rarityScore', 'desc');

  return sortedNFTs;
}

export default main;
