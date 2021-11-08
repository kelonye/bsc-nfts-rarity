import '../src/utils/dotenv';
import load from '../src/nfts/load';
import { COLLECTIONS } from '../src/config';

main().then(
  () => process.exit(),
  (err: Error) => {
    console.log(err);
    process.exit(-1);
  }
);

async function main() {
  const slug = process.env.slug!;
  if (!slug || !COLLECTIONS[slug]) throw new Error('slug required');
  await load(slug);
}
