import fetch from 'node-fetch';
import Batch from 'batch';

import { COLLECTIONS } from '../config';
import * as db from './db';

async function main(slug: string) {
  const { count } = COLLECTIONS[slug];

  return new Promise((resolve, reject) => {
    const batch = new Batch();

    batch.concurrency(100);

    for (let i = 1; i <= count; i++) {
      ((j: number) => {
        batch.push(async (done) => {
          try {
            done(null, await fetchNFT(slug, j));
          } catch (err) {
            done(err);
          }
        });
      })(i);
    }

    batch.end(async (err) => {
      if (err) return reject(err);
      resolve(true);
    });
  });
}

async function fetchNFT(slug: string, index: number) {
  const { url } = COLLECTIONS[slug];
  const c = await db.nft(slug);

  if (await c.findOne({ index }))
    return console.log('skipping %s(%s)', slug, index);

  console.log('loading %s(%s)', slug, index);
  try {
    const nft: db.RawNFT = await request(url(index));
    if (!nft?.attributes) return;
    const attributes = nft.attributes
      .filter((attribute) => attribute.trait_type && attribute.value)
      .map((attribute) => ({
        traitType: attribute.trait_type!,
        value: attribute.value!,
        percentile: 0,
        count: 0,
        rarityScore: 0,
        missingTraits: [],
      }));
    if (!attributes) return;
    await c.updateOne(
      { index },
      {
        $set: {
          index,
          image: nft.image,
          attributes,
        },
      },
      {
        upsert: true,
      }
    );
  } catch (e) {
    console.warn(e);
  }
}

async function request(url: string) {
  const res = await fetch(url, {
    headers: {
      Accepts: 'application/json',
      'Content-Type': 'application/json',
      'User-Agent':
        'Mozilla/5.0 (iPhone; CPU iPhone OS 6_0 like Mac OS X) AppleWebKit/536.26 (KHTML, like Gecko) Version/6.0 Mobile/10A5376e Safari/8536.25',
    },
  });
  return await res.json();
}

export default main;
