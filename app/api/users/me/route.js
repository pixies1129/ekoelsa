import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

export async function GET(request) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await redis.hgetall(`user:${empId}`);
  if (Object.keys(user).length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.points = parseInt(user.points);
  user.carbonSaved = parseFloat(user.carbonSaved);
  user.pledgeDone = user.pledgeDone === 'true';

  const totalCarbon = await redis.get('stats:totalCarbon');
  user.totalCarbon = parseFloat(totalCarbon || 0);

  return NextResponse.json(user);
}
