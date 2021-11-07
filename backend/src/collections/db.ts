import * as redis from '../utils/redis';
import error from '../utils/error';
import { PAGE, COLLECTIONS } from '../config';
import { getRedisNFTKey, getRedisSortedNFTsKey } from '../nfts/utils';

export async function all() {
  return Object.entries(COLLECTIONS).map(([slug, c]) => ({ ...c, slug }));
}

export async function one(slug: string, page: number) {
  // console.log('slug', slug);
  if (!(slug in COLLECTIONS)) throw error(404);

  const { count } = COLLECTIONS[slug];

  const min = (page - 1) * PAGE;
  const max = min + PAGE - 1;
  // console.log('min, max = %s, %s', min, max);
  const ids: string[] = await redis.exec('zrange', [
    getRedisSortedNFTsKey(slug),
    min,
    max,
  ]);
  // console.log(ids);
  const jobs: any[] = ids.map((key) =>
    redis.exec('get', [getRedisNFTKey(slug, parseInt(key))])
  );
  const data: string[] = await Promise.all(jobs);
  const nfts = data
    .map((s, i) => {
      if (s) {
        const nft = JSON.parse(s);
        nft.id = ids[i];
        return nft;
      }
      return null;
    })
    .filter((n) => n && n.attributes);

  return {
    nfts,
    pages: Math.round(count / PAGE),
  };
}
