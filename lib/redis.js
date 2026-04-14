import Redis from 'ioredis';

let redis;

if (process.env.REDIS_URL) {
  // 실제 Redis 서버 연결 (Vercel 환경 변수 REDIS_URL 필요)
  redis = new Redis(process.env.REDIS_URL);
  
  // ioredis에 없는 커스텀 메서드 추가 (기존 코드 호환성 유지)
  if (!redis.incrbyfloat) {
    redis.incrbyfloat = async (key, increment) => {
      const current = parseFloat(await redis.get(key) || 0);
      const inc = parseFloat(increment || 0);
      const newVal = parseFloat((current + inc).toFixed(3));
      await redis.set(key, newVal);
      return newVal;
    };
  }
} else {
  // 로컬 개발용 Mock Redis (서버 재시작 시 초기화됨)
  console.log('🔄 Using Mock Redis for local development...');
  
  if (!global._redis) {
    const storage = new Map();
    const sortedSets = new Map();

    global._redis = {
      get: async (key) => {
        const val = storage.get(key);
        return val !== undefined ? val.toString() : null;
      },
      set: async (key, val) => { 
        storage.set(key, val); 
        return 'OK'; 
      },
      exists: async (key) => storage.has(key) ? 1 : 0,
      hgetall: async (key) => {
        const obj = storage.get(key) || {};
        const result = {};
        for (const [k, v] of Object.entries(obj)) {
          result[k] = v !== undefined ? v.toString() : '';
        }
        return result;
      },
      hget: async (key, field) => {
        const obj = storage.get(key) || {};
        const val = obj[field];
        return val !== undefined ? val.toString() : null;
      },
      hset: async (key, fieldOrObj, val) => {
        let obj = storage.get(key) || {};
        if (typeof fieldOrObj === 'object' && fieldOrObj !== null) {
          obj = { ...obj, ...fieldOrObj };
        } else {
          obj[fieldOrObj] = val;
        }
        storage.set(key, obj);
        return 1;
      },
      hincrby: async (key, field, increment) => {
        let obj = storage.get(key) || {};
        const current = parseInt(obj[field] || 0, 10);
        const newVal = current + parseInt(increment || 0, 10);
        obj[field] = newVal;
        storage.set(key, obj);
        return newVal;
      },
      incrbyfloat: async (key, increment) => {
        const current = parseFloat(storage.get(key) || 0);
        const inc = parseFloat(increment || 0);
        const newVal = parseFloat((current + inc).toFixed(3));
        storage.set(key, newVal);
        return newVal;
      },
      zadd: async (setKey, score, member) => {
        let set = sortedSets.get(setKey) || new Map();
        set.set(member, parseFloat(score));
        sortedSets.set(setKey, set);
        return 1;
      },
      zrem: async (setKey, member) => {
        let set = sortedSets.get(setKey) || new Map();
        const removed = set.delete(member);
        sortedSets.set(setKey, set);
        return removed ? 1 : 0;
      },
      zrevrange: async (setKey, start, stop, withScores) => {
        const set = sortedSets.get(setKey) || new Map();
        const sorted = Array.from(set.entries())
          .sort((a, b) => b[1] - a[1])
          .slice(start, stop + 1);
        
        if (withScores === 'WITHSCORES') {
          const result = [];
          sorted.forEach(([member, score]) => {
            result.push(member, score.toString());
          });
          return result;
        }
        return sorted.map(([member]) => member);
      },
      del: async (key) => { storage.delete(key); return 1; },
      on: () => {},
    };
  }
  redis = global._redis;
}

export default redis;
