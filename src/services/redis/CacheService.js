const redis = require('redis');

class CacheService {
  constructor() {
    this._client = redis.createClient({
      socket: {
        host: process.env.REDIS_SERVER,
      },
    });

    this._client.on('error', (error) => {
      console.error(error);
    });

    this._client.connect();
  }

  async set(key, value, expirationInSecond = 3600) {
    await this._client.set(key, value, {
      EX: expirationInSecond,
    });
  }

  async get(key) {
    const result = await this._client.get(key);

    if(result === null) throw new Error('Cache tidak ditemukan');
    return result;
  }

  // tidak menggungakan async Karena kita sama sekali tidak menuliskan await di dalam body fungsi, 
  // melainkan langsung mengembalikan dengan nilai dari fungsi this._client.del yang merupakan sebuah Promise.
  delete(key) {
    return this._client.del(key);
  }
}

module.exports = CacheService;