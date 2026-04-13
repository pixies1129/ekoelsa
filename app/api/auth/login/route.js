import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import redis from '@/lib/redis';

export async function POST(request) {
  const { empId, password } = await request.json();
  console.log(`[Auth] Login attempt - EmpID: ${empId}`);

  const user = await redis.hgetall(`user:${empId}`);
  console.log(`[Auth] User found in Redis: ${Object.keys(user).length > 0 ? 'YES' : 'NO'}`);

  if (Object.keys(user).length === 0 || user.password !== password) {
    return NextResponse.json(
      { error: '사번 또는 비밀번호가 일치하지 않습니다.' },
      { status: 401 }
    );
  }

  const token = uuidv4();
  await redis.set(`token:${token}`, empId, 'EX', 86400);

  return NextResponse.json({ token, empId, userName: user.userName });
}
