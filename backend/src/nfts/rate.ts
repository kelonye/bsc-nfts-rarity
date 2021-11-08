import Batch from 'batch';
import { COLLECTIONS } from '../config';
import * as db from './db';

async function main(slug: string) {
  return new Promise(async (resolve, reject) => {
    const { name, count } = COLLECTIONS[slug];
    const c = await db.nft(slug);

    const nfts: db.NFT[] = ((await c.find({}).toArray()) ?? []) as db.NFT[];

    const { nfts: sortedNFTs, allTraits } = await rateNFTs(nfts);

    const batch = new Batch();

    batch.concurrency(1000);

    for (const nft of sortedNFTs) {
      batch.push(async (done) => {
        try {
          console.log('saving %s(%s)', slug, nft.index);
          const {
            traitCount,
            percentile,
            attributes,
            missingTraits,
            rarityScore,
          } = nft;
          await c.updateOne(
            { index: nft.index },
            {
              $set: {
                traitCount,
                percentile,
                attributes,
                missingTraits,
                rarityScore,
              },
            }
          );
          done();
        } catch (err) {
          done(err);
        }
      });
    }

    batch.end(async (err) => {
      if (err) return reject(err);

      await (
        await db.collection()
      ).updateOne(
        { slug },
        { $set: { slug, count, name, traits: allTraits } },
        { upsert: true }
      );

      resolve(true);
    });
  });
}

async function rateNFTs(nfts: db.NFT[]) {
  const allTraits = {};
  const attrCount = {};

  // aggregate all attrs
  let totalTraits = 0;
  nfts.forEach(({ attributes }) => {
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
  nfts.forEach((nft) => {
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
    nft.missingTraits = [];
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

  return { nfts, allTraits };
}

export default main;
