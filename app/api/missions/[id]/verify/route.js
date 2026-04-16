import { NextResponse } from 'next/server';
import redis from '@/lib/redis';
import { verifyToken } from '@/lib/auth';
import { todayMissions } from '@/lib/missions';
import { GoogleGenerativeAI } from '@google/generative-ai';

const MISSION_OBJECTS = {
  m2: '대중교통 (버스 내부, 지하철 내부, 정류장 등)',
  m3: '다회용컵 또는 텀블러 (reusable cup or tumbler)',
  m5: '줍깅/플로깅 활동 (쓰레기를 줍는 모습 또는 집게와 봉투)',
  m10: '컴퓨터 또는 스마트폰의 이메일함 화면 (삭제된 메일 또는 비워진 편지함)',
  m12: '에어컨/난방기 리모컨 또는 디스플레이의 온도 표시',
};

export async function POST(request, { params }) {
  try {
    const empId = await verifyToken(request);
    if (!empId) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json().catch(() => ({}));
    const { points: bodyPoints, carbon: bodyCarbon, image } = body;
    
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
        return NextResponse.json({ error: '존재하지 않는 미션입니다.' }, { status: 400 });
      }

      const today = new Date().toISOString().split('T')[0];
      const limitKey = `mission:limit:${empId}:${id}:${today}`;
      if (await redis.exists(limitKey)) {
        return NextResponse.json({ error: '오늘 이미 이 미션을 완료하셨습니다.' }, { status: 400 });
      }
    }

    // AI 이미지 분석 로직
    if (image && MISSION_OBJECTS[id]) {
      const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
      
      if (!apiKey) {
        console.warn('[AI] Gemini API Key is missing. Bypassing AI verification.');
      } else {
        try {
          console.log(`[AI] Analyzing image for mission: ${id}`);
          const genAI_instance = new GoogleGenerativeAI(apiKey);
          const model = genAI_instance.getGenerativeModel({ model: 'gemini-1.5-flash' });
          
          const base64Data = image.split(',')[1];
          const target = MISSION_OBJECTS[id];
          
          const prompt = `이 사진은 환경 보호 미션 인증 사진이야.
          사진 속에 "${target}"이(가) 포함되어 있는지 확인해줘.
          
          판단 기준:
          1. 물체가 식별 가능할 정도로 명확하게 보이는가?
          2. 해당 미션 주제와 직접적인 연관이 있는가?
          
          결과 응답:
          - 조건에 부합하면 오직 "YES"라고만 대답해.
          - 조건에 부합하지 않거나 물체를 찾을 수 없다면 "NO"라고 대답하고, 그 이유를 한 문장의 한국어로 짧게 적어줘. (예: "NO 사진이 너무 어두워 계단을 식별할 수 없습니다.")`;

          const result = await model.generateContent([
            prompt,
            {
              inlineData: {
                data: base64Data,
                mimeType: 'image/jpeg'
              }
            }
          ]);

          const response = await result.response;
          const text = response.text().trim();
          
          console.log(`[AI] Gemini Response for ${id}: ${text}`);

          if (text.toUpperCase().includes('NO')) {
            const reason = text.replace(/NO/gi, '').trim() || '미션과 관련 없는 사진으로 판단됩니다.';
            return NextResponse.json({ 
              error: `AI 인증 실패: ${reason}`
            }, { status: 400 });
          }
        } catch (aiErr) {
          console.error('[AI] Gemini Analysis Error:', aiErr);
          // 서비스 장애 시에는 사용자 경험을 위해 일단 통과 (필요 시 정책 변경 가능)
          console.log('[AI] AI service error, bypassing verification.');
        }
      }
    }

    const finalPoints = bodyPoints !== undefined ? parseInt(bodyPoints) : mission.points;
    const finalCarbon = bodyCarbon !== undefined ? parseFloat(bodyCarbon) : mission.carbon;

    const newPoints = await redis.hincrby(userKey, 'points', finalPoints);
    const currentCarbon = (await redis.hget(userKey, 'carbonSaved')) || 0;
    const newCarbon = parseFloat((parseFloat(currentCarbon) + finalCarbon).toFixed(3));
    
    await redis.hset(userKey, 'carbonSaved', newCarbon);
    await redis.zadd('rankings', newPoints, empId);
    await redis.incrbyfloat('stats:totalCarbon', finalCarbon);

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

    return NextResponse.json({ empId, points: newPoints, carbonSaved: newCarbon });
  } catch (err) {
    console.error('[Mission] Critical Error:', err);
    return NextResponse.json({ error: '서버 오류가 발생했습니다.' }, { status: 500 });
  }
}
