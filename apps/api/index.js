const express = require('express');
const cors = require('cors');
const Redis = require('ioredis'); // ioredis 라이브러리 사용
const { v4: uuidv4 } = require('uuid');
const app = express();

app.use(cors({
  origin: ['http://localhost:3000', process.env.FRONTEND_URL],
  credentials: true
}));
app.use(express.json());

// REDIS_URL 환경변수를 사용하여 Redis 클라이언트 생성
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
  console.log('✅ Redis connection established successfully.');
});

redis.on('error', (err) => {
  console.error('❌ Redis connection error:', err.message);
  console.error('   Please make sure your Redis server is running.');
});

// Middleware: 토큰 검증
const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  const empId = await redis.get(`token:${token}`);
  if (!empId) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }

  req.empId = empId;
  next();
};

// 고정된 미션 데이터
const todayMissions = [
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032, type: 'photo' },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05, type: 'photo' },
  { id: 'm4', title: '페이퍼리스', points: 30, carbon: 0.029, type: 'text' },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1, type: 'photo' },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1, type: 'qr' }
];

// 1. 사용자 온보딩
app.post('/api/users/onboard', async (req, res) => {
  const { userName, empId, charType, password } = req.body;
  const userKey = `user:${empId}`;
  
  const exists = await redis.exists(userKey);
  if (!exists) {
    // Redis Hash로 사용자 정보 저장
    await redis.hset(userKey, {
      userName,
      empId,
      charType,
      password, // 실제 서비스에서는 해싱 필수
      points: 0,
      carbonSaved: 0
    });
    // 랭킹 (Sorted Set) 초기화
    await redis.zadd('rankings', 0, empId);
  }
  res.status(201).json({ message: 'Success' });
});

// 2. 로그인
app.post('/api/auth/login', async (req, res) => {
  const { empId, password } = req.body;
  const userKey = `user:${empId}`;
  
  const user = await redis.hgetall(userKey);
  if (Object.keys(user).length === 0 || user.password !== password) {
    return res.status(401).json({ error: 'Invalid ID or password' });
  }

  const token = uuidv4();
  // 토큰 24시간 유효
  await redis.set(`token:${token}`, empId, 'EX', 86400);
  
  res.json({ token, empId, userName: user.userName });
});

// 3. 로그아웃
app.post('/api/auth/logout', verifyToken, async (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (token) {
    await redis.del(`token:${token}`);
  }
  res.json({ message: 'Logged out successfully' });
});

// 4. 프로필 조회 (보호됨)
app.get('/api/users/me', verifyToken, async (req, res) => {
  const empId = req.empId;
  const userKey = `user:${empId}`;
  const user = await redis.hgetall(userKey);
  
  if (Object.keys(user).length > 0) {
    // Redis hgetall은 숫자를 문자열로 반환하므로 숫자로 변환
    user.points = parseInt(user.points);
    user.carbonSaved = parseFloat(user.carbonSaved);
    res.json(user);
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 5. 미션 목록 조회
app.get('/api/missions', (req, res) => {
  res.json(todayMissions);
});

// 6. 미션 인증 (보호됨)
app.post('/api/missions/:id/verify', verifyToken, async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;
  const empId = req.empId;
  const mission = todayMissions.find(m => m.id === id);

  if (!mission) return res.status(400).json({ error: 'Mission not found' });

  const userKey = `user:${empId}`;
  const exists = await redis.exists(userKey);

  if (exists) {
    // 1. 포인트 증가
    const newPoints = await redis.hincrby(userKey, 'points', mission.points);
    
    // 2. 탄소 저감량 증가 (부동 소수점 오차 방지)
    const currentCarbon = await redis.hget(userKey, 'carbonSaved') || 0;
    const newCarbon = parseFloat((parseFloat(currentCarbon) + mission.carbon).toFixed(3));
    await redis.hset(userKey, 'carbonSaved', newCarbon);

    // 3. 랭킹 업데이트
    await redis.zadd('rankings', newPoints, empId);

    // (선택사항) 인증 기록 저장 로직을 여기에 추가할 수 있습니다.
    console.log(`[Mission] ${empId} completed ${mission.title}: ${content}`);

    res.json({ empId, points: newPoints, carbonSaved: newCarbon });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 7. 랭킹 조회 (Sorted Set 역순 정렬)
app.get('/api/rankings', async (req, res) => {
  // 포인트 높은 순(Desc)으로 상위 50명 조회
  const rawRankings = await redis.zrevrange('rankings', 0, 49, 'WITHSCORES');
  
  const rankings = [];
  for (let i = 0; i < rawRankings.length; i += 2) {
    const empId = rawRankings[i];
    const points = parseInt(rawRankings[i + 1]);
    const user = await redis.hgetall(`user:${empId}`);
    
    rankings.push({
      rank: (i / 2) + 1,
      empId,
      userName: user.userName || 'Unknown',
      points,
      charType: user.charType || 'type1'
    });
  }
  res.json(rankings);
});

// 8. 포인트 선물 (보호됨)
app.post('/api/points/gift', verifyToken, async (req, res) => {
  const { to, points } = req.body; // to is now empId
  const from = req.empId;
  const senderKey = `user:${from}`;
  const receiverKey = `user:${to}`;

  const senderPoints = parseInt(await redis.hget(senderKey, 'points') || 0);
  
  if (senderPoints >= points) {
    const newSenderPoints = await redis.hincrby(senderKey, 'points', -points);
    const newReceiverPoints = await redis.hincrby(receiverKey, 'points', points);
    
    await redis.zadd('rankings', newSenderPoints, from);
    await redis.zadd('rankings', newReceiverPoints, to);
    
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Transfer failed' });
  }
});

// 로컬 실행용
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3001; 
  app.listen(PORT, () => {
    console.log(`Redis Connected (URL: ${process.env.REDIS_URL ? 'External' : 'Local'})`);
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
