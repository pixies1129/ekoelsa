import { NextResponse } from 'next/server';

const todayMissions = [
  { id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0, type: 'pledge', description: '지구를 위한 소중한 약속에 동참해주세요.' },
  { id: 'm8', title: '폐배터리 수거', points: 50, carbon: 0.1, type: 'qr', description: '장비실에 부착된 QR코드를 찍어주세요.' },
  { id: 'm1', title: '계단 이용', points: 20, carbon: 0.032, type: 'photo', description: '계단에 보이는 층을 찍어주세요.' },
  { id: 'm3', title: '다회용컵 이용', points: 15, carbon: 0.05, type: 'photo', description: '사용중인 다회용컵을 찍어주세요.' },
  { id: 'm7', title: '콘센트 미차단 신고', points: 20, carbon: 0.1, type: 'photo', description: '끄지 않은 콘센트를 찍어주세요.' },
  { id: 'm10', title: '메일함 비우기', points: 15, carbon: 0.001, type: 'photo', description: '삭제한 메일함을 찍어주세요.' },
  { id: 'm12', title: '실내 적정온도 유지', points: 20, carbon: 0.05, type: 'photo', description: '에어컨의 적정온도를 찍어주세요.' },
];

export async function GET() {
  return NextResponse.json(todayMissions);
}
