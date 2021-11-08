import * as redis from '../utils/redis';

export function getRedisNFTKey(slug: string, i: number) {
  return redis.prefix([slug, 'nft', i.toString()]);
}

export function getRedisSortedNFTsKey(slug: string) {
  return redis.prefix([slug, 'sorted-nfts']);
}

export function getRedisTraitsKey(slug: string) {
  return redis.prefix([slug, 'traits']);
}
