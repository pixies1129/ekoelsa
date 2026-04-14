import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { todayMissions } from '@/lib/missions';

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
      mission = { id: 'pledge', title: '모두의 에너지지킴이 서약', points: 50, carbon: 1.0 };
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

      const today = new Date().toISOString().split('T')[0];
      const limitKey = `mission:limit:${empId}:${id}:${today}`;
      if (await redis.exists(limitKey)) {
        return NextResponse.json({ error: '오늘 이미 이 미션을 완료하셨습니다.' }, { status: 400 });
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

    // 주간 그래프를 위한 일별 탄소저감량 기록
    const todayStr = new Date().toISOString().split('T')[0];
    const dailyCarbonKey = `carbon:${empId}:${todayStr}`;
    const currentDailyCarbon = parseFloat(await redis.get(dailyCarbonKey) || '0');
    await redis.set(dailyCarbonKey, (currentDailyCarbon + finalCarbon).toFixed(3));

    if (id === 'pledge') {
      await redis.hset(userKey, 'pledgeDone', 'true');
    } else {
      const limitKey = `mission:limit:${empId}:${id}:${todayStr}`;
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
