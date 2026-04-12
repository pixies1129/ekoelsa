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
  CupSoda
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
  const [shuffledMissions, setShuffledMissions] = useState([]);

  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  useEffect(() => {
    if (missions && missions.length > 0) {
      const allMissions = [
        { 
          id: 'pledge', 
          title: '모두의 에너지지킴이 서약', 
          points: 50, 
          carbon: 1.0, 
          type: 'pledge' 
        },
        ...missions
      ];
      setShuffledMissions(shuffleArray(allMissions));
    }
  }, [missions]);

  const isMissionDone = (id) => {
    if (id === 'pledge') return pledgeDone;
    return todayMissions[id] === new Date().toISOString().split('T')[0];
  };

  const getActionBtn = (id, title, points, carbon, type, btnClass, textClass, customText) => {
    const isDone = isMissionDone(id);
    if (isDone) {
      const doneText = id === 'pledge' ? '서약 완료 ✅' : '오늘 참여 완료';
      return (
        <button disabled className="w-full bg-gray-100 text-gray-400 py-2 rounded-xl text-xs font-bold flex justify-center items-center">
          <CheckCircle className="mr-2 w-3.5 h-3.5" /> {doneText}
        </button>
      );
    }
    
    let onClickFn = () => {};
    let Icon = Camera;
    let btnText = customText || '사진 인증';

    if (type === 'text') {
      onClickFn = () => onHandleTextMission(id, title, points, carbon);
      Icon = MessageSquare;
      btnText = customText || '내용 입력 인증';
    } else if (type === 'qr') {
      onClickFn = onQrClick;
      Icon = QrCode;
      btnText = customText || 'QR 스캔 방법안내';
    } else if (type === 'pledge') {
      onClickFn = onOpenPledgeModal;
      Icon = CheckSquare;
      btnText = '서약하기';
    } else {
      onClickFn = () => onTriggerCamera(id, title, points, carbon);
    }
    
    return (
      <button onClick={onClickFn} className={`w-full ${btnClass} ${textClass} py-2 rounded-xl text-xs font-bold flex justify-center items-center transition-colors cursor-pointer`}>
        <Icon className="mr-1.5 w-3.5 h-3.5" /> {btnText}
      </button>
    );
  };

  const missionIcons = {
    pledge: ShieldCheck,
    m8: Battery,
    m4: FileText,
    m1: Footprints,
    m7: Plug,
    m3: Coffee,
    m10: Mail,
    m11: Car,
    m12: Thermometer,
    m13: CupSoda
  };

  const missionColors = {
    pledge: { bg: 'bg-rose-50', text: 'text-rose-600', icon: 'text-rose-500' },
    m8: { bg: 'bg-yellow-50', text: 'text-yellow-700', icon: 'text-yellow-500' },
    m4: { bg: 'bg-purple-50', text: 'text-purple-600', icon: 'text-purple-500' },
    m1: { bg: 'bg-blue-50', text: 'text-blue-600', icon: 'text-blue-500' },
    m7: { bg: 'bg-red-50', text: 'text-red-600', icon: 'text-red-500' },
    m3: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    m10: { bg: 'bg-emerald-50', text: 'text-emerald-600', icon: 'text-emerald-500' },
    m11: { bg: 'bg-sky-50', text: 'text-sky-600', icon: 'text-sky-500' },
    m12: { bg: 'bg-orange-50', text: 'text-orange-600', icon: 'text-orange-500' },
    m13: { bg: 'bg-teal-50', text: 'text-teal-600', icon: 'text-teal-500' }
  };

  return (
    <div className="p-5 space-y-3 animate-in pb-10">
      <h2 className="text-lg font-bold text-gray-800 mb-2 flex items-center">
        <ListTodo className="mr-2 text-green-600 w-5 h-5" />진행중인 미션
      </h2>
      
      {shuffledMissions.map((m) => {
        const Icon = missionIcons[m.id] || ListTodo;
        const colors = missionColors[m.id] || { bg: 'bg-gray-50', text: 'text-gray-600', icon: 'text-gray-400' };
        
        return (
          <div key={m.id} className="bg-white rounded-2xl p-3.5 shadow-sm border border-gray-200">
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <div className={`w-8 h-8 ${colors.bg} rounded-full flex items-center justify-center mr-3`}>
                  <Icon className={`${colors.icon} w-4 h-4`} />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 text-[13px]">
                    {m.title} {m.id === 'pledge' && <span className="font-normal text-gray-400 text-[9px]">(1회성)</span>}
                  </h3>
                  {m.id !== 'pledge' && <p className="text-[9px] text-gray-500 mt-0.5">저감량: {m.carbon}kg</p>}
                </div>
              </div>
              <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-[10px] font-bold h-fit">+{m.points}P</div>
            </div>
            {m.id === 'm8' && <p className="text-[11px] text-gray-500 mb-3 px-1 truncate">장비실에 폐배터리 수거 후 QR코드를 스캔하세요.</p>}
            {getActionBtn(
              m.id, 
              m.title, 
              m.points, 
              m.carbon, 
              m.type,
              colors.bg,
              colors.text,
              m.id === 'pledge' ? '서약하기' : (m.type === 'qr' ? 'QR 스캔 방법안내' : (m.type === 'text' ? '내용 입력 인증' : '사진 인증'))
            )}
          </div>
        );
      })}
    </div>
  );
}
