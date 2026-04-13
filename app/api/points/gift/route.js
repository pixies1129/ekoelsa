import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

export async function POST(request) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { to, points } = await request.json();
  const senderKey = `user:${empId}`;
  const receiverKey = `user:${to}`;

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
