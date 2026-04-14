import { NextResponse } from 'next/server';
import redis from '@/lib/redis';

export async function POST(request) {
  const { userName, empId, password, charType } = await request.json();
  if (!userName || !empId || !password) {
    return NextResponse.json({ error: '필수 정보 누락' }, { status: 400 });
  }

  try {
    const userKey = `user:${empId}`;
    if (await redis.exists(userKey)) {
      return NextResponse.json({ error: '이미 등록된 사번' }, { status: 400 });
    }

    await redis.hset(userKey, {
      userName,
      empId,
      password,
      charType: charType || 'type1',
      points: 0,
      carbonSaved: 0,
    });
    await redis.zadd('rankings', 0, empId);

    console.log(`[Auth] User registered - EmpID: ${empId}`);
    return NextResponse.json({ message: 'Success' }, { status: 201 });
  } catch (error) {
    console.error(`[Auth] Registration error for EmpID ${empId}:`, error);
    return NextResponse.json({ error: '회원가입 중 서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
