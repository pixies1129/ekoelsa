'use client';

import { Leaf, BookOpenCheck, Award, CheckCircle2 } from 'lucide-react';

export default function HomeTab({ profile, onOpenCharacterModal, onOpenEduModal, missionStats }) {
  if (!profile) return null;

  const getLevelInfo = (currentPoints, type) => {
    const types = {
      type1: { l1: '/images/characters/t1_l1.png', l2: '/images/characters/t1_l2.png', l3: '/images/characters/t1_l3.png', l4: '/images/characters/t1_l4.png' },
      type2: { l1: '/images/characters/t2_l1.png', l2: '/images/characters/t2_l2.png', l3: '/images/characters/t2_l3.png', l4: '/images/characters/t2_l4.png' },
      type3: { l1: '/images/characters/t3_l1.png', l2: '/images/characters/t3_l2.png', l3: '/images/characters/t3_l3.png', l4: '/images/characters/t3_l4.png' }
    };
    const images = types[type] || types.type1;

    if (currentPoints < 1000) return { level: 1, name: '(1/3)', image: images.l1, max: 1000, color: 'text-green-400' };
    if (currentPoints < 2000) return { level: 2, name: '(2/3)', image: images.l2, max: 2000, color: 'text-blue-400' };
    if (currentPoints < 3000) return { level: 3, name: '(3/3)', image: images.l3, max: 3000, color: 'text-indigo-500' };
    return { level: 4, name: '성장완료', image: images.l4, max: 3000, color: 'text-gray-800' };
  };

  const getProgressPercent = () => {
    const levelInfo = getLevelInfo(profile.points, profile.charType);
    if (levelInfo.level === 4) return 100;
    let base = (levelInfo.level - 1) * 1000;
    return Math.min(100, Math.max(0, ((profile.points - base) / 1000) * 100));
  };

  const levelInfo = getLevelInfo(profile.points, profile.charType);
  const percent = getProgressPercent();

  const typeStyles = {
    type1: { border: 'border-green-200', ring: 'bg-green-400', blob: 'bg-green-100', hover: 'hover:bg-green-50' },
    type2: { border: 'border-blue-200', ring: 'bg-blue-400', blob: 'bg-blue-100', hover: 'hover:bg-blue-50' },
    type3: { border: 'border-indigo-200', ring: 'bg-indigo-400', blob: 'bg-indigo-100', hover: 'hover:bg-indigo-50' }
  };
  const ts = typeStyles[profile.charType];

  let charAnimation = 'animate-breath'; 
  if (levelInfo.level === 2) charAnimation = 'animate-sway'; 
  if (levelInfo.level === 3) charAnimation = 'animate-float'; 
  if (levelInfo.level === 4) charAnimation = 'animate-bounce-slow scale-110';

  return (
    <div className="flex flex-col h-full items-center p-3 space-y-3 animate-in" suppressHydrationWarning>
      <div className="w-full flex-1 bg-white rounded-xl p-4 shadow-sm border border-green-100 flex flex-col items-center justify-between" suppressHydrationWarning>
        <div className="flex justify-between w-full items-center mb-1">
          <h2 className="text-base font-bold text-gray-700">에코 캐릭터</h2>
          <span className="text-[10px] text-gray-400">클릭하여 변경</span>
        </div>
        
        <div onClick={onOpenCharacterModal} className={`cursor-pointer relative w-32 h-32 sm:w-40 sm:h-40 bg-white flex items-center justify-center border-2 border-dashed ${ts.border} rounded-full ${ts.hover} transition-all z-0 my-auto`} suppressHydrationWarning>
          <div className={`absolute inset-0 rounded-full ${ts.ring} animate-pulse-ring z-[-2]`} suppressHydrationWarning></div>
          {levelInfo.level >= 3 && <div className={`absolute inset-0 ${ts.blob} opacity-60 animate-spin-slow z-[-1]`} style={{ borderRadius: '40% 60% 70% 30% / 40% 50% 60% 50%' }} suppressHydrationWarning></div>}
          <img 
            src={levelInfo.image} 
            alt="character" 
            className={`w-24 h-24 sm:w-32 sm:h-32 object-contain select-none z-10 ${charAnimation} transition-transform duration-500`} 
            suppressHydrationWarning 
          />
          {levelInfo.level === 4 && <div className="absolute -top-1 -right-1 bg-yellow-400 text-white text-[9px] sm:text-[10px] font-bold px-2 py-1 rounded-full shadow z-20" suppressHydrationWarning><Award className="mr-1 w-2.5 h-2.5 sm:w-3 sm:h-3 inline" />완성!</div>}
        </div>

        <div className="text-center w-full mt-1" suppressHydrationWarning>
          <div className="flex justify-between items-end mb-1.5">
            <span className={`font-bold text-lg ${levelInfo.color}`}>Lv.{levelInfo.level} {levelInfo.name}</span>
            <span className="text-xs text-gray-500">{profile.points} / {levelInfo.level === 4 ? 'MAX' : `${levelInfo.max} P`}</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden" suppressHydrationWarning>
            <div className="h-full bg-green-500 transition-all duration-1000 ease-out" style={{ width: `${percent}%` }} suppressHydrationWarning></div>
          </div>
        </div>
      </div>

      <div onClick={onOpenEduModal} className="w-full cursor-pointer bg-emerald-50 p-3.5 rounded-xl shadow-sm border border-emerald-300 flex items-center justify-center hover:bg-emerald-100 transition-colors shrink-0">
        <BookOpenCheck className="text-emerald-600 mr-2.5 w-7 h-7" />
        <div className="flex flex-col">
          <span className="text-[11px] text-emerald-700 font-medium leading-tight mb-0.5">지구를 위한</span>
          <span className="text-[15px] font-bold text-emerald-900 leading-tight">탄소중립 실천 교육</span>
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
          <span className="text-[11px] text-gray-500 font-medium">나의 누적 탄소저감</span>
          <span className="text-[18px] font-bold text-gray-800 mt-0.5">{(profile.carbonSaved || 0).toFixed(2)} kg</span>
        </div>
      </div>
    </div>
  );
}
