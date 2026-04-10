const express = require('express');
const cors = require('cors');
const Redis = require('ioredis'); // ioredis 라이브러리 사용
const app = express();

app.use(cors());
app.use(express.json());

// REDIS_URL 환경변수를 사용하여 Redis 클라이언트 생성
// REDIS_URL 예: redis://default:password@host:port
const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

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
  const { userName, charType } = req.body;
  const userKey = `user:${userName}`;
  
  const exists = await redis.exists(userKey);
  if (!exists) {
    // Redis Hash로 사용자 정보 저장
    await redis.hset(userKey, {
      userName,
      charType,
      points: 0,
      carbonSaved: 0
    });
    // 랭킹 (Sorted Set) 초기화
    await redis.zadd('rankings', 0, userName);
  }
  res.status(201).json({ message: 'Success' });
});

// 2. 프로필 조회
app.get('/api/users/me', async (req, res) => {
  const { userName } = req.query;
  const userKey = `user:${userName}`;
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

// 3. 미션 목록 조회
app.get('/api/missions', (req, res) => {
  res.json(todayMissions);
});

// 4. 미션 인증
app.post('/api/missions/:id/verify', async (req, res) => {
  const { id } = req.params;
  const { userName } = req.body;
  const mission = todayMissions.find(m => m.id === id);

  if (!mission) return res.status(400).json({ error: 'Mission not found' });

  const userKey = `user:${userName}`;
  const exists = await redis.exists(userKey);

  if (exists) {
    // 1. 포인트 증가
    const newPoints = await redis.hincrby(userKey, 'points', mission.points);
    
    // 2. 탄소 저감량 증가
    const currentCarbon = await redis.hget(userKey, 'carbonSaved') || 0;
    const newCarbon = +(parseFloat(currentCarbon) + mission.carbon).toFixed(3);
    await redis.hset(userKey, 'carbonSaved', newCarbon);

    // 3. 랭킹 업데이트
    await redis.zadd('rankings', newPoints, userName);

    res.json({ userName, points: newPoints, carbonSaved: newCarbon });
  } else {
    res.status(404).json({ error: 'User not found' });
  }
});

// 5. 랭킹 조회 (Sorted Set 역순 정렬)
app.get('/api/rankings', async (req, res) => {
  // 포인트 높은 순(Desc)으로 상위 50명 조회
  const rawRankings = await redis.zrevrange('rankings', 0, 49, 'WITHSCORES');
  
  const rankings = [];
  for (let i = 0; i < rawRankings.length; i += 2) {
    const userName = rawRankings[i];
    const points = parseInt(rawRankings[i + 1]);
    const charType = await redis.hget(`user:${userName}`, 'charType') || 'type1';
    
    rankings.push({
      rank: (i / 2) + 1,
      userName,
      points,
      charType
    });
  }
  res.json(rankings);
});

// 6. 포인트 선물
app.post('/api/points/gift', async (req, res) => {
  const { from, to, points } = req.body;
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
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Redis Connected (URL: ${process.env.REDIS_URL ? 'External' : 'Local'})`);
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
