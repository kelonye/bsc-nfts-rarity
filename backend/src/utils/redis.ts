import redis from 'redis';

const client = redis.createClient();

export function exec(fn: string, ...args): any {
  return new Promise((resolve, reject) =>
    client[fn](...args, (err, ret) => {
      if (err) return reject(err);
      resolve(ret);
    })
  );
}

export function prefix(s) {
  return s.join(':');
}
