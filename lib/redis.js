import Redis from 'ioredis';

let redis;

if (!global._redis) {
  global._redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: 3,
    retryStrategy(times) {
      if (times > 3) return null;
      return Math.min(times * 100, 2000);
    },
  });
  global._redis.on('connect', () => console.log('✅ Redis connected.'));
  global._redis.on('error', (err) => console.error('❌ Redis error:', err.message));
}

redis = global._redis;

export default redis;
