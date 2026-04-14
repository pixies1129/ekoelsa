import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

const ADMIN_ID = '20220055';

export async function POST(request, { params }) {
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

    // 포인트 및 탄소저감량 초기화
    await redis.hset(userKey, {
      points: 0,
      carbonSaved: 0,
      pledgeDone: 'false' // 서약도 초기화할지 선택 사항 (여기서는 초기화)
    });

    // 랭킹 점수도 0으로 업데이트
    await redis.zadd('rankings', 0, empId);

    return NextResponse.json({ message: '사용자 데이터가 초기화되었습니다.' });
  } catch (error) {
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
