import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, points } = await request.json();
  const receiverKey = `user:${to}`;

  // 관리자(20220055)는 포인트 차감 없이 지급 가능
  if (empId === '20220055') {
    if (points > 5000) {
      return NextResponse.json({ error: '최대 5000포인트까지 지급 가능합니다.' }, { status: 400 });
    }
    const nrPoints = await redis.hincrby(receiverKey, 'points', points);
    await redis.zadd('rankings', nrPoints, to);
    return NextResponse.json({ success: true });
  }

  // 일반 사용자는 자신의 포인트에서 차감하여 선물
  const senderKey = `user:${empId}`;
  const sPoints = parseInt((await redis.hget(senderKey, 'points')) || 0);
  if (sPoints >= points) {
    const nsPoints = await redis.hincrby(senderKey, 'points', -points);
    const nrPoints = await redis.hincrby(receiverKey, 'points', points);
    await redis.zadd('rankings', nsPoints, empId);
    await redis.zadd('rankings', nrPoints, to);
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ error: '포인트 부족' }, { status: 400 });
}
