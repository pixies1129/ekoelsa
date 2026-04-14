import { NextResponse } from 'next/server';
import { todayMissions } from '@/lib/missions';

export async function GET() {
  return NextResponse.json(todayMissions);
}
