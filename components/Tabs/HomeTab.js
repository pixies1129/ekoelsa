'use client';

import { Leaf, BookOpenCheck, Award, CheckCircle2 } from 'lucide-react';

export default function HomeTab({ profile, onOpenCharacterModal, onOpenEduModal, missionStats }) {
  if (!profile) return null;

  const getLevelInfo = (currentPoints, type) => {
    const types = {
      type1: { l1: '🌱', l2: '🌿', l3: '🌳' }, // 나무 (새싹 -> 작은 나무 -> 큰 나무)
      type2: { l1: '/images/bear01.png', l2: '/images/bear02.png', l3: '/images/bear03.png' }, // 북극곰 (이미지 1, 2, 3단계)
      type3: { l1: '🥚', l2: '🐣', l3: '🐧' }  // 펭귄 (알 -> 갓 깬 아기 펭귄 -> 몸 전체 성체 펭귄)
    };
    const assets = types[type] || types.type1;
    const isImage = typeof assets.l1 === 'string' && assets.l1.startsWith('/');

    if (currentPoints < 1000) return { level: 1, name: '', asset: assets.l1, isImage, max: 1000, color: 'text-blue-400' };
    if (currentPoints < 2000) return { level: 2, name: '', asset: assets.l2, isImage, max: 2000, color: 'text-yellow-500' };
    return { level: 3, name: '성장완료', asset: assets.l3, isImage, max: 2000, color: 'text-indigo-600' };
  };

  const getProgressPercent = () => {
    const levelInfo = getLevelInfo(profile.points, profile.charType);
    if (levelInfo.level === 3) return 100;
    let base = (levelInfo.level - 1) * 1000;
    return Math.min(100, Math.max(0, ((profile.points - base) / 1000) * 100));
  };

  const levelInfo = getLevelInfo(profile.points, profile.charType);
  const percent = getProgressPercent();

  const typeStyles = {
    type1: { border: 'border-blue-200', ring: 'bg-blue-400', blob: 'bg-blue-100', hover: 'hover:bg-blue-50' },
    type2: { border: 'border-yellow-200', ring: 'bg-yellow-400', blob: 'bg-yellow-100', hover: 'hover:bg-yellow-50' },
    type3: { border: 'border-green-200', ring: 'bg-green-400', blob: 'bg-green-100', hover: 'hover:bg-green-50' }
  };
  const ts = typeStyles[profile.charType];

  let charAnimation = 'animate-breath'; 
  if (levelInfo.level === 2) charAnimation = 'animate-float'; 
  if (levelInfo.level === 3) charAnimation = 'animate-bounce-slow scale-110';

  return (
    <div className="flex flex-col h-full items-center p-3 space-y-3 animate-in" suppressHydrationWarning>
      <div className="w-full flex-1 bg-white rounded-xl p-4 shadow-sm border border-green-100 flex flex-col items-center justify-between" suppressHydrationWarning>
        <div className="flex justify-between w-full items-center mb-1">
          <h2 className="text-base font-bold text-gray-700">에코 캐릭터</h2>
          <span className="text-[10px] text-gray-400">그림을 클릭하여 변경</span>
        </div>
        
        <div onClick={onOpenCharacterModal} className={`cursor-pointer relative w-32 h-32 sm:w-40 sm:h-40 bg-white flex items-center justify-center border-2 border-dashed ${ts.border} rounded-full ${ts.hover} transition-all z-0 my-auto`} suppressHydrationWarning>
          <div className={`absolute inset-0 rounded-full ${ts.ring} animate-pulse-ring z-[-2]`} suppressHydrationWarning></div>
          {levelInfo.level >= 2 && <div className={`absolute inset-0 ${ts.blob} opacity-60 animate-spin-slow z-[-1]`} style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} suppressHydrationWarning></div>}
          {levelInfo.isImage ? (
            <div className={`w-36 h-36 sm:w-52 sm:h-52 overflow-hidden flex items-center justify-center ${charAnimation}`} suppressHydrationWarning>
              <img src={levelInfo.asset} alt="Character" className="w-full h-full object-contain scale-125" />
            </div>
          ) : (
            <span className={`text-5xl sm:text-6xl select-none inline-block ${charAnimation} transition-transform duration-500`} suppressHydrationWarning>{levelInfo.asset}</span>
          )}
          {levelInfo.level === 3 && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow z-10" suppressHydrationWarning><Award className="mr-1 w-2.5 h-2.5 sm:w-3 sm:h-3 inline" />완성!</div>}
        </div>

        <div className="text-center w-full mt-1" suppressHydrationWarning>
          <div className="flex justify-between items-end mb-1.5">
            <span className={`font-bold text-lg ${levelInfo.color}`}>Lv.{levelInfo.level} {levelInfo.name}</span>
            <span className="text-xs text-gray-500">{profile.points} / {levelInfo.level === 3 ? 'MAX' : `${levelInfo.max} P`}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden" suppressHydrationWarning>
            <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} suppressHydrationWarning></div>
          </div>
        </div>
      </div>

      <div onClick={onOpenEduModal} className="w-full cursor-pointer bg-emerald-50 p-3.5 rounded-xl shadow-sm border border-emerald-300 flex items-center justify-center hover:bg-emerald-100 transition-colors shrink-0">
        <BookOpenCheck className="text-emerald-600 mr-2.5 w-7 h-7" />
        <div className="flex flex-col">
          <span className="text-[11px] text-emerald-700 font-medium leading-tight mb-0.5">지구를 지키고 원유를 아끼는</span>
          <span className="text-[15px] font-bold text-emerald-900 leading-tight">스마트 에너지 실천법</span>
        </div>
      </div>

      <div className="w-full grid grid-cols-2 gap-3 shrink-0">
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-green-100 flex flex-col items-center justify-center text-center">
          <CheckCircle2 className="text-blue-500 mb-1.5 w-6 h-6" />
          <span className="text-[11px] text-gray-500 font-medium">오늘의 미션 현황</span>
          <span className="text-[18px] font-bold text-gray-800 mt-0.5">{missionStats?.completed || 0} / {missionStats?.total || 0}</span>
        </div>
        <div className="bg-white p-3.5 rounded-xl shadow-sm border border-green-100 flex flex-col items-center justify-center text-center">
          <Leaf className="text-green-500 mb-1.5 w-6 h-6" />
          <span className="text-[11px] text-gray-500 font-medium">나의 누적 에너지절약</span>
          <span className="text-[18px] font-bold text-gray-800 mt-0.5">{(profile.carbonSaved || 0).toFixed(2)} kg</span>
          <p className="text-[8px] text-gray-400 mt-1 leading-tight">*탄소저감 1kg당 원유 약 400ml 절감</p>
        </div>
      </div>
    </div>
  );
}
