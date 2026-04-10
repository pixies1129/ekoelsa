const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory 데이터 저장소 (서버 재시작 시 초기화됩니다)
let users = [
  { userName: '홍길동', points: 100, carbonSaved: 0.5, charType: 'type1' },
  { userName: '김철수', points: 50, carbonSaved: 0.1, charType: 'type2' }
];

let todayMissions = [
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032, type: 'photo' },
  { id: 'm4', title: '페이퍼리스', points: 30, carbon: 0.029, type: 'text' },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1, type: 'qr' }
];

// 1. 사용자 온보딩
app.post('/api/users/onboard', (req, res) => {
  const { userName, charType } = req.body;
  if (!users.find(u => u.userName === userName)) {
    users.push({ userName, charType, points: 0, carbonSaved: 0 });
  }
  res.status(201).json({ message: 'Success' });
});

// 2. 프로필 조회
app.get('/api/users/me', (req, res) => {
  const { userName } = req.query;
  const user = users.find(u => u.userName === userName);
  if (user) res.json(user);
  else res.status(404).json({ error: 'User not found' });
});

// 3. 미션 목록 조회
app.get('/api/missions', (req, res) => {
  res.json(todayMissions);
});

// 4. 미션 인증
app.post('/api/missions/:id/verify', (req, res) => {
  const { id } = req.params;
  const { userName, content } = req.body;
  const user = users.find(u => u.userName === userName);
  const mission = todayMissions.find(m => m.id === id);

  if (user && mission) {
    user.points += mission.points;
    user.carbonSaved = +(user.carbonSaved + mission.carbon).toFixed(3);
    res.json(user);
  } else {
    res.status(400).json({ error: 'Invalid data' });
  }
});

// 5. 랭킹 조회
app.get('/api/rankings', (req, res) => {
  const sorted = [...users].sort((a, b) => b.points - a.points);
  res.json(sorted.map((u, i) => ({ rank: i + 1, ...u })));
});

// 6. 포인트 선물
app.post('/api/points/gift', (req, res) => {
  const { from, to, points } = req.body;
  const sender = users.find(u => u.userName === from);
  const receiver = users.find(u => u.userName === to);

  if (sender && receiver && sender.points >= points) {
    sender.points -= points;
    receiver.points += points;
    res.json({ success: true });
  } else {
    res.status(400).json({ error: 'Transfer failed' });
  }
});

// Vercel Serverless Function export
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}

module.exports = app;
