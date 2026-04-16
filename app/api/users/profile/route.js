import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

export async function PATCH(request) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { charType } = await request.json();
  if (!charType) {
    return NextResponse.json({ error: '캐릭터 타입이 필요합니다.' }, { status: 400 });
  }

  try {
    const userKey = `user:${empId}`;
    await redis.hset(userKey, 'charType', charType);
    
    return NextResponse.json({ success: true, charType });
  } catch (error) {
    console.error(`[User] Profile update error for EmpID ${empId}:`, error);
    return NextResponse.json({ error: '프로필 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
