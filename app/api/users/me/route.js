import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { todayMissions } from '../missions/route';

export async function GET(request) {
  const empId = await verifyToken(request);
  if (!empId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const user = await redis.hgetall(`user:${empId}`);
  if (Object.keys(user).length === 0) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  user.points = parseInt(user.points);
  user.carbonSaved = parseFloat(user.carbonSaved);
  user.pledgeDone = user.pledgeDone === 'true';

  const totalCarbon = await redis.get('stats:totalCarbon');
  user.totalCarbon = parseFloat(totalCarbon || 0);

  // 최근 7일간의 주간 탄소저감량 데이터 조회
  const days = ['일', '월', '화', '수', '목', '금', '토'];
  const weeklyData = [];
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now.getTime() - (i * 24 * 60 * 60 * 1000));
    const dateStr = d.toISOString().split('T')[0]; // UTC 기준 (미션 저장 기준과 동일)
    
    const val = await redis.get(`carbon:${empId}:${dateStr}`);
    weeklyData.push({
      day: days[d.getDay()],
      value: parseFloat(val || '0')
    });
  }
  
  user.weeklyData = weeklyData;

  // 오늘 완료한 미션 목록 조회
  const completedMissions = {};
  if (user.pledgeDone) {
    completedMissions['pledge'] = todayStr;
  }
  
  for (const mission of todayMissions) {
    if (mission.id === 'pledge' || mission.id === 'm8') continue;
    
    const limitKey = `mission:limit:${empId}:${mission.id}:${todayStr}`;
    const isDone = await redis.exists(limitKey);
    if (isDone) {
      completedMissions[mission.id] = todayStr;
    }
  }
  
  // m8은 제한 키가 없으므로 클라이언트 상태에 의존하거나 여기서 별도로 처리해야 함
  // 서버에서 m8의 상태를 추적하려면 m8 전용 키를 만들어야 합니다.
  
  user.completedMissions = completedMissions;

  return NextResponse.json(user);
}
