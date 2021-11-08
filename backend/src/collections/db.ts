import error from '../utils/error';
import { PAGE, COLLECTIONS } from '../config';
import * as db from '../nfts/db';

export async function all() {
  return (await db.collection()).find().sort({ name: -1 }).toArray();
}

export async function one(
  slug: string,
  page: number,
  filters: Record<string, string[]>
) {
  // console.log('slug', slug);
  if (!(slug in COLLECTIONS)) throw error(404);

  const traitTypes: string[] = [];
  let values: string[] = [];
  Object.entries(filters).forEach(([filter, v]) => {
    traitTypes.push(filter);
    values = values.concat(v);
  });
  // console.log(traitTypes, values);
  const query = !(traitTypes.length && values.length)
    ? {}
    : {
        'attributes.traitType': { $all: traitTypes },
        'attributes.value': { $all: values },
      };

  const { count } = COLLECTIONS[slug];
  const min = (page - 1) * PAGE;

  const nfts = await (await (await db.nft(slug)).find(query))
    .sort({ rarityScore: -1 })
    .skip(min)
    .limit(PAGE)
    .toArray();

  return {
    nfts,
    pages: Math.round(count / PAGE),
  };
}
