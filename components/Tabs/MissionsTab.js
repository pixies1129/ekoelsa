'use client';

import { useState, useEffect } from 'react';
import { 
  ListTodo, 
  ShieldCheck, 
  CheckSquare, 
  CheckCircle, 
  Battery, 
  FileText, 
  Footprints, 
  Plug, 
  Coffee, 
  QrCode, 
  Camera, 
  MessageSquare,
  Mail,
  Car,
  Thermometer,
  CupSoda,
  Bus,
  Recycle,
  Bike,
  HeartHandshake
} from 'lucide-react';

export default function MissionsTab({ 
  missions, 
  todayMissions, 
  pledgeDone,
  onOpenPledgeModal, 
  onTriggerCamera, 
  onHandleTextMission, 
  onQrClick 
}) {
  const [displayMissions, setDisplayMissions] = useState([]);

  useEffect(() => {
    if (missions && missions.length > 0) {
      // 1. pledge, m8, m9 미션 추출 (고정 상단 배치용)
      const pledge = missions.find(m => m.id === 'pledge');
      const m8 = missions.find(m => m.id === 'm8');
      const m9 = missions.find(m => m.id === 'm9');
      
      // 2. 나머지 미션들 (원래 순서 유지)
      const others = missions.filter(m => m.id !== 'pledge' && m.id !== 'm8' && m.id !== 'm9');
      
      // 3. 고정된 순서로 합치기 [pledge, m8, m9, ...others]
      const combined = [];
      if (pledge) combined.push(pledge);
      if (m8) combined.push(m8);
      if (m9) combined.push(m9);
      combined.push(...others);
      
      setDisplayMissions(combined);
    }
  }, [missions]);

  const isMissionDone = (id) => {
    if (id === 'pledge') return pledgeDone;
    return todayMissions[id] === new Date().toISOString().split('T')[0];
  };

  const getActionBtn = (id, title, points, carbon, type, btnClass, textClass, customText) => {
    const isDone = isMissionDone(id);
    
    let onClickFn = () => {};
    let Icon = Camera;
    let btnText = customText || '사진 인증';

    if (type === 'text') {
      onClickFn = () => onHandleTextMission(id, title, points, carbon);
      Icon = MessageSquare;
      btnText = customText || '내용 입력 인증';
    } else if (type === 'qr') {
      onClickFn = () => onQrClick({ id, title });
      Icon = QrCode;
      btnText = customText || 'QR 스캔 방법안내';
    } else if (type === 'pledge') {
      onClickFn = onOpenPledgeModal;
      Icon = CheckSquare;
      btnText = isDone ? '서약 내용 보기' : '서약하기';
    } else {
      onClickFn = () => onTriggerCamera(id, title, points, carbon);
    }
    
    if (isDone && id !== 'pledge') {
      return (
        <button disabled className="w-full bg-gray-100 text-gray-400 py-2.5 rounded-xl text-sm font-bold flex justify-center items-center">
          <CheckCircle className="mr-2 w-4 h-4" /> 오늘 참여 완료
        </button>
      );
    }
    
    return (
      <button onClick={onClickFn} className={`w-full ${isDone ? 'bg-rose-100 text-rose-700 hover:bg-rose-200 border border-rose-200' : `${btnClass} ${textClass}`} py-2.5 rounded-xl text-sm font-bold flex justify-center items-center transition-colors cursor-pointer`}>
        {isDone ? <CheckCircle className="mr-1.5 w-4 h-4 text-rose-500" /> : <Icon className="mr-1.5 w-4 h-4" />} 
        {isDone && id === 'pledge' ? '서약 완료 ✅ (내용 보기)' : btnText}
      </button>
    );
  };

  const missionIcons = {
    pledge: ShieldCheck,
    m8: Battery,
    m9: HeartHandshake,
    m4: FileText,
    m2: Bus,
    m5: Recycle,
    m3: Coffee,
    m10: Mail,
    m11: Car,
    m12: Thermometer,
    m13: CupSoda
  };

  const missionColors = {
    pledge: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'text-rose-500' },
    m8: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-500' },
    m9: { bg: 'bg-pink-50', text: 'text-pink-600', icon: 'text-pink-500' },
    m4: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    m2: { bg: 'bg-indigo-50', text: 'text-indigo-600', icon: 'text-indigo-500' },
    m5: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' },
    m3: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    m10: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    m11: { bg: 'bg-sky-50', text: 'text-sky-600', icon: 'text-sky-500' },
    m12: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    m13: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' }
  };

  return (
    <div className="p-5 space-y-4 animate-in pb-10">
      <h2 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
        <ListTodo className="mr-2 text-green-600 w-6 h-6" />진행중인 미션
      </h2>
      
      {displayMissions.map((m) => {
        const Icon = missionIcons[m.id] || ListTodo;
        const colors = missionColors[m.id] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'text-gray-400' };
        
        return (
          <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-9 h-9 ${colors.bg} rounded-full flex items-center justify-center mr-3`}>
                  <Icon className={`${colors.icon} w-5 h-5`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-[16px]">
                    {m.title} {m.id === 'pledge' && <span className="font-normal text-gray-400 text-[11px]">(1회성)</span>}
                  </h3>
                </div>
              </div>
              <div className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded text-[13px] font-bold h-fit">{m.id === 'm8' ? '최대 +' : '+'}{m.points}P</div>
            </div>
            {m.description && (
              <p className="text-[14px] text-gray-500 mb-4 px-1">
                {m.description}
                {m.id !== 'pledge' && (
                  <span className="text-green-600 font-medium ml-1.5 whitespace-nowrap">
                    (탄소저감 {m.carbon}kg으로 원유 {Math.round(m.carbon * 400)}mL 절약)
                  </span>
                )}
              </p>
            )}
            {getActionBtn(
              m.id, 
              m.title, 
              m.points, 
              m.carbon, 
              m.type,
              colors.bg,
              colors.text,
              m.id === 'pledge' ? '서약하기' : (m.type === 'qr' ? '담당자 신고' : (m.type === 'text' ? '내용 입력 인증' : '사진 인증'))
            )}
          </div>
        );
      })}
    </div>
  );
}
