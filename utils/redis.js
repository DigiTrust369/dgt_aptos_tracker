const redis = require("redis");

const options = {
    url: 'redis://localhost:6379'
};
  
const client = redis.createClient(options);

client.on('error', (e) => {
    logger.error(`Redis connection error: ${e.message}`);
});

client.on('connect', () => {
    logger.info('Redis connected');
});

module.exports = {
    client: client,
    set   : (key, value) => {
      client.set(key, value);
    },
    setExpire : (key, value, time) => {
      client.set(key, value, 'EX', time);
    },
    setex : (key, value, maxAge = 30 * 24 * 60 * 60) => {
      client.setex(key, maxAge, value);
    },
    hmset : (hash, values) => {
      client.hmset(hash, values);
    },
    get   : async (key) => {
      return getAsync(key);
    },
    hmget : async (hash, keys) => {
      if (!hash || !keys || keys.length <= 0) return [];
      return hmgetAsync(hash, keys);
    },
    del   : (key) => {
      client.del(key);
    },
};