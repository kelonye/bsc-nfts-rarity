import { MongoClient, Db, Collection } from 'mongodb';
import { MONGO_URL } from '../config';

const DB = db();

function db(): Promise<Db> {
  return new Promise(function (resolve, reject) {
    MongoClient.connect(MONGO_URL, function (err, client) {
      if (err) return reject(err);
      resolve(client!.db('bsc-rarity'));
    });
  });
}

async function collection(c: string): Promise<Collection> {
  const db = await DB;
  return db.collection(c);
}

export default collection;
