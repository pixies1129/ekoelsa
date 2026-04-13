import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

const todayMissions = [
  { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1 },
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032 },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05 },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1 },
  { id: 'm10', title: '메일함 비우기', points: 15, carbon: 0.001 },
  { id: 'm12', title: '실내 적정온도 유지', points: 20, carbon: 0.05 },
];

export async function POST(request, { params }) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;
  const userKey = `user:${empId}`;
  let mission;

  if (id === 'pledge') {
    mission = { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 };
    const user = await redis.hgetall(userKey);
    if (user.pledgeDone === 'true') {
      return NextResponse.json({ error: '이미 서약을 완료하셨습니다.' }, { status: 400 });
    }
  } else {
    mission = todayMissions.find((m) => m.id === id);
    if (!mission) {
      return NextResponse.json({ error: 'Mission not found' }, { status: 400 });
    }

    if (id !== 'm8') {
      const today = new Date().toISOString().split('T')[0];
      const limitKey = `mission:limit:${empId}:${id}:${today}`;
      if (await redis.exists(limitKey)) {
        return NextResponse.json({ error: '오늘 이미 이 미션을 완료하셨습니다.' }, { status: 400 });
      }
    }
  }

  const newPoints = await redis.hincrby(userKey, 'points', mission.points);
  const currentCarbon = (await redis.hget(userKey, 'carbonSaved')) || 0;
  const newCarbon = parseFloat((parseFloat(currentCarbon) + mission.carbon).toFixed(3));
  await redis.hset(userKey, 'carbonSaved', newCarbon);
  await redis.zadd('rankings', newPoints, empId);
  await redis.incrbyfloat('stats:totalCarbon', mission.carbon);

  if (id === 'pledge') {
    await redis.hset(userKey, 'pledgeDone', 'true');
  } else if (id !== 'm8') {
    const today = new Date().toISOString().split('T')[0];
    const limitKey = `mission:limit:${empId}:${id}:${today}`;
    await redis.set(limitKey, '1', 'EX', 86400);
  }

  return NextResponse.json({ empId, points: newPoints, carbonSaved: newCarbon });
}
