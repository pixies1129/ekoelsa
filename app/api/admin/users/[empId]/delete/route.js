import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

const ADMIN_ID = '20220055';

export async function DELETE(request, { params }) {
  try {
    const requesterId = await verifyToken(request);
    if (requesterId !== ADMIN_ID) {
      return NextResponse.json({ error: '관리자 권한이 없습니다.' }, { status: 403 });
    }

    const { empId } = await params;
    const userKey = `user:${empId}`;

    if (!(await redis.exists(userKey))) {
      return NextResponse.json({ error: '사용자를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 랭킹에서 제거
    await redis.zrem('rankings', empId);
    
    // 유저 정보 삭제
    await redis.del(userKey);

    return NextResponse.json({ message: '사용자가 삭제되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
