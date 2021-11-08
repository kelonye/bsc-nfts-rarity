const NODE_ENV = process.env.NODE_ENV;

export const SECRET = process.env.SECRET;

export const TEST = NODE_ENV === 'test';

export const PRODUCTION = NODE_ENV === 'production';

export const COLLECTIONS = {
  'cyber-bearz-army': {
    name: 'Cyber Bearz Army',
    count: 2048, // 4096,
    url: (i: number) =>
      `https://blackrainbow.mypinata.cloud/ipfs/QmaXVYEQEMMykH5zkwUYxhe836gKgmA2vRVV5cYQouKkAr/2/${i}/index.json`,
  },
  'shit-punks': {
    name: 'Shit Punks',
    count: 1e4,
    url: (i: number) =>
      `https://acy9375pq6.execute-api.us-east-1.amazonaws.com/shitPunkMeta?index=${i}`,
  },
};

export const PAGE = 9 * 5;
