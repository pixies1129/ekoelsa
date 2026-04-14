import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';

const todayMissions = [
  { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1 },
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032 },
  { id: 'm2', title: '대중교통 이용', points: 25, carbon: 1.0 },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05 },
  { id: 'm4', title: '페이퍼리스', points: 30, carbon: 0.029 },
  { id: 'm5', title: '줍깅/플로깅 참여', points: 30, carbon: 0.5 },
  { id: 'm6', title: '자전거 이용', points: 25, carbon: 0.5 },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1 },
  { id: 'm10', title: '메일함 비우기', points: 15, carbon: 0.001 },
  { id: 'm12', title: '실내 적정온도 유지', points: 20, carbon: 0.05 },
];

export async function POST(request, { params }) {
  try {
    const empId = await verifyToken(request);
    console.log(`[Mission] Verify attempt - EmpID: ${empId}`);
    
    if (!empId) {
      console.error('[Mission] Unauthorized: No EmpID found for token');
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { points: bodyPoints, carbon: bodyCarbon } = body;
    
    console.log(`[Mission] Target ID: ${id}`);
    
    const userKey = `user:${empId}`;
    let mission;

    if (id === 'pledge') {
      mission = { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 };
      const user = await redis.hgetall(userKey);
      if (user.pledgeDone === 'true') {
        return NextResponse.json({ error: '이미 서약을 완료하셨습니다.' }, { status: 400 });
      }
    } else {
      mission = todayMissions.find((m) => m.id === id);
      if (!mission) {
        console.error(`[Mission] Not Found: ${id}`);
        return NextResponse.json({ error: '존재하지 않는 미션입니다.' }, { status: 400 });
      }

      if (id !== 'm8') {
        const today = new Date().toISOString().split('T')[0];
        const limitKey = `mission:limit:${empId}:${id}:${today}`;
        if (await redis.exists(limitKey)) {
          return NextResponse.json({ error: '오늘 이미 이 미션을 완료하셨습니다.' }, { status: 400 });
        }
      }
    }

    console.log(`[Mission] Processing: ${mission.title} (+${bodyPoints ?? mission.points} pts)`);

    const finalPoints = bodyPoints !== undefined ? parseInt(bodyPoints) : mission.points;
    const finalCarbon = bodyCarbon !== undefined ? parseFloat(bodyCarbon) : mission.carbon;

    const newPoints = await redis.hincrby(userKey, 'points', finalPoints);
    const currentCarbon = (await redis.hget(userKey, 'carbonSaved')) || 0;
    const newCarbon = parseFloat((parseFloat(currentCarbon) + finalCarbon).toFixed(3));
    
    await redis.hset(userKey, 'carbonSaved', newCarbon);
    await redis.zadd('rankings', newPoints, empId);
    await redis.incrbyfloat('stats:totalCarbon', finalCarbon);

    if (id === 'pledge') {
      await redis.hset(userKey, 'pledgeDone', 'true');
    } else if (id !== 'm8') {
      const today = new Date().toISOString().split('T')[0];
      const limitKey = `mission:limit:${empId}:${id}:${today}`;
      await redis.set(limitKey, '1', 'EX', 86400);
    }

    console.log(`[Mission] Success: ${empId} now has ${newPoints} points`);
    return NextResponse.json({ empId, points: newPoints, carbonSaved: newCarbon });
  } catch (err) {
    console.error('[Mission] Critical Error:', err);
    // 에러 메시지를 직접 전달하여 무엇이 문제인지 화면에서 바로 확인 가능하게 함
    return NextResponse.json({ 
      error: `서버 오류: ${err.message}\n${err.stack?.split('\n')[1] || ''}`
    }, { status: 500 });
  }
}
