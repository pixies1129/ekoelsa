import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

export async function DELETE(request) {
  try {
    const empId = await verifyToken(request);
    if (!empId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userKey = `user:${empId}`;
    const userExists = await redis.exists(userKey);
    
    if (!userExists) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // 1. 랭킹에서 제거
    await redis.zrem('rankings', empId);
    
    // 2. 누적 통계에서 개인의 탄소저감량 차감 (선택적: 유지할 수도 있지만 정확도를 위해 차감)
    const carbonSaved = parseFloat(await redis.hget(userKey, 'carbonSaved') || '0');
    if (carbonSaved > 0) {
      await redis.incrbyfloat('stats:totalCarbon', -carbonSaved);
    }
    
    // 3. 유저 정보 키 삭제
    await redis.del(userKey);
    
    // 4. (선택) 유저의 매일 미션 기록 등 부가 데이터 삭제
    // 여기서는 핵심 정보만 삭제합니다.

    return NextResponse.json({ message: 'Account successfully deleted' });
  } catch (error) {
    console.error('[DeleteAccount] Error:', error);
    return NextResponse.json({ error: `탈퇴 처리 중 오류가 발생했습니다: ${error.message}` }, { status: 500 });
  }
}
