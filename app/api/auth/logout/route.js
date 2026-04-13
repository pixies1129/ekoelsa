import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.split(' ')[1];
  if (token) await redis.del(`token:${token}`);
  return NextResponse.json({ message: 'Logged out' });
}
