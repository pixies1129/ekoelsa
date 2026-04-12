const express = require('express');
const cors = require('cors');
const Redis = require('ioredis');
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
  maxRetriesPerRequest: 3,
  retryStrategy(times) {
    if (times > 3) return null;
    return Math.min(times * 100, 2000);
  }
});

redis.on('connect', () => console.log('✅ Redis connected.'));
redis.on('error', (err) => console.error('❌ Redis error:', err.message));

// Middleware: 토큰 검증 (사번 기반)
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'No token provided' });

  const empId = await redis.get(`token:${token}`);
  if (!empId) return res.status(401).json({ error: 'Invalid or expired token' });

  req.empId = empId;
  next();
};

const todayMissions = [
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032, type: 'photo' },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05, type: 'photo' },
  { id: 'm4', title: '페이퍼리스', points: 30, carbon: 0.029, type: 'text' },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1, type: 'photo' },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1, type: 'qr' },
  { id: 'm10', title: '메일함 비우기', points: 15, carbon: 0.001, type: 'text' },
  { id: 'm11', title: '에코 드라이빙', points: 15, carbon: 0.1, type: 'text' },
  { id: 'm12', title: '실내 적정온도 유지', points: 20, carbon: 0.05, type: 'photo' },
  { id: 'm13', title: '개인컵/텀블러 사용', points: 15, carbon: 0.01, type: 'photo' }
];

// 1. 회원가입
app.post('/api/users/onboard', async (req, res) => {
  const { userName, empId, password, charType } = req.body;
  if (!userName || !empId || !password) return res.status(400).json({ error: '필수 정보 누락' });

  const userKey = `user:${empId}`;
  if (await redis.exists(userKey)) return res.status(400).json({ error: '이미 등록된 사번' });

  await redis.hset(userKey, {
    userName,
    empId,
    password,
    charType: charType || 'type1',
    points: 0,
    carbonSaved: 0
  });
  await redis.zadd('rankings', 0, empId);
  res.status(201).json({ message: 'Success' });
});

// 2. 로그인 (사번 기반)
app.post('/api/auth/login', async (req, res) => {
  const { empId, password } = req.body;
  console.log(`[Auth] Login attempt - EmpID: ${empId}`); // 로그 추가

  const user = await redis.hgetall(`user:${empId}`);
  console.log(`[Auth] User found in Redis: ${Object.keys(user).length > 0 ? 'YES' : 'NO'}`);

  if (Object.keys(user).length === 0 || user.password !== password) {
    return res.status(401).json({ error: '사번 또는 비밀번호가 일치하지 않습니다.' });
  }

  const token = uuidv4();
  await redis.set(`token:${token}`, empId, 'EX', 86400);
  res.json({ token, empId, userName: user.userName });
});

// 3. 로그아웃
app.post('/api/auth/logout', async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) await redis.del(`token:${token}`);
  res.json({ message: 'Logged out' });
});

// 4. 내 정보 조회
app.get('/api/users/me', verifyToken, async (req, res) => {
  const user = await redis.hgetall(`user:${req.empId}`);
  if (Object.keys(user).length > 0) {
    user.points = parseInt(user.points);
    user.carbonSaved = parseFloat(user.carbonSaved);
    user.pledgeDone = user.pledgeDone === "true";
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 5. 미션 목록
app.get('/api/missions', (req, res) => res.json(todayMissions));

// 6. 미션 인증
app.post('/api/missions/:id/verify', verifyToken, async (req, res) => {
  const { id } = req.params;
  let mission;
  const userKey = `user:${req.empId}`;

  // Handle 'pledge' mission specially
  if (id === 'pledge') {
    mission = { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 };
    const user = await redis.hgetall(userKey);
    if (user.pledgeDone === "true") {
      return res.status(400).json({ error: '이미 서약을 완료하셨습니다.' });
    }
  } else {
    mission = todayMissions.find(m => m.id === id);
    if (!mission) return res.status(400).json({ error: 'Mission not found' });

    // Daily limit check (except m8)
    if (id !== 'm8') {
      const today = new Date().toISOString().split('T')[0];
      const limitKey = `mission:limit:${req.empId}:${id}:${today}`;
      if (await redis.exists(limitKey)) {
        return res.status(400).json({ error: '오늘 이미 이 미션을 완료하셨습니다.' });
      }
    }
  }

  const newPoints = await redis.hincrby(userKey, 'points', mission.points);
  const currentCarbon = await redis.hget(userKey, 'carbonSaved') || 0;
  const newCarbon = parseFloat((parseFloat(currentCarbon) + mission.carbon).toFixed(3));
  await redis.hset(userKey, 'carbonSaved', newCarbon);
  await redis.zadd('rankings', newPoints, req.empId);

  // Success handling: set limits
  if (id === 'pledge') {
    await redis.hset(userKey, 'pledgeDone', 'true');
  } else if (id !== 'm8') {
    const today = new Date().toISOString().split('T')[0];
    const limitKey = `mission:limit:${req.empId}:${id}:${today}`;
    await redis.set(limitKey, '1', 'EX', 86400); // 24 hours
  }

  res.json({ empId: req.empId, points: newPoints, carbonSaved: newCarbon });
});

// 7. 랭킹
app.get('/api/rankings', async (req, res) => {
  const raw = await redis.zrevrange('rankings', 0, 49, 'WITHSCORES');
  const rankings = [];
  for (let i = 0; i < raw.length; i += 2) {
    const eid = raw[i];
    const user = await redis.hgetall(`user:${eid}`);
    rankings.push({
      rank: (i / 2) + 1,
      empId: eid,
      userName: user.userName || 'Unknown',
      points: parseInt(raw[i + 1]),
      charType: user.charType || 'type1'
    });
  }
  res.json(rankings);
});

// 8. 포인트 선물
app.post('/api/points/gift', verifyToken, async (req, res) => {
  const { to, points } = req.body;
  const senderKey = `user:${req.empId}`;
  const receiverKey = `user:${to}`;

  const sPoints = parseInt(await redis.hget(senderKey, 'points') || 0);
  if (sPoints >= points) {
    const nsPoints = await redis.hincrby(senderKey, 'points', -points);
    const nrPoints = await redis.hincrby(receiverKey, 'points', points);
    await redis.zadd('rankings', nsPoints, req.empId);
    await redis.zadd('rankings', nrPoints, to);
    res.json({ success: true });
  } else {
    res.status(400).json({ error: '포인트 부족' });
  }
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001;
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;
