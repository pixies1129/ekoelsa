import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function GET() {
  const raw = await redis.zrevrange('rankings', 0, 49, 'WITHSCORES');
  const rankings = [];

  for (let i = 0; i < raw.length; i += 2) {
    const eid = raw[i];
    const user = await redis.hgetall(`user:${eid}`);
    rankings.push({
      rank: i / 2 + 1,
      empId: eid,
      userName: user.userName || 'Unknown',
      points: parseInt(raw[i + 1]),
      charType: user.charType || 'type1',
    });
  }

  return NextResponse.json(rankings);
}
