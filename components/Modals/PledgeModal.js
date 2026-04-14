'use client';

import { useState, useEffect } from 'react';
import { ShieldCheck, Check } from 'lucide-react';

export default function PledgeModal({ isOpen, onClose, onConfirm, isDone = false, userName = '지사원' }) {
  const [isChecked, setIsChecked] = useState(false);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (isDone) {
        setIsChecked(true);
      } else {
        setIsChecked(false);
      }
      
      // 날짜 포맷팅 (예: 2026년 4월 14일)
      const now = new Date();
      const formattedDate = `${now.getFullYear()}년 ${now.getMonth() + 1}월 ${now.getDate()}일`;
      setTodayDate(formattedDate);
    }
  }, [isOpen, isDone]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (isDone) {
      onClose();
      return;
    }
    if (isChecked) {
      onConfirm();
    } else {
      alert('서약서 내용에 동의하고 체크해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in max-h-[85vh] flex flex-col">
        <h2 className="text-xl font-extrabold text-center text-green-700 mb-2 flex items-center justify-center">
          <ShieldCheck className="mr-2 w-6 h-6" /> 모두의 에너지지킴이 서약
        </h2>
        <p className="text-xs text-gray-500 text-center mb-5">
          지속 가능한 미래와 건강한 지구를 위한 우리의 약속
        </p>
        
        <div className="flex-1 overflow-y-auto bg-green-50/50 rounded-xl p-4 border border-green-100 text-sm text-gray-700 leading-relaxed mb-5 shadow-inner">
          <p className="mb-3">
            기후 변화는 더 이상 먼 미래의 이야기가 아닙니다. 지금 우리가 서 있는 이곳, 일상 속 작은 실천들이 모여 지구의 내일을 바꿀 수 있습니다.
          </p>
          <p className="mb-3">
            나 하나쯤이야 하는 생각보다는 <strong>'나부터 시작하자'</strong>는 마음으로, 한국승강기안전공단 일원으로서 다음 세대에게 깨끗하고 푸른 환경을 물려주기 위해 앞장서겠습니다.
          </p>
          <ul className="list-disc pl-5 space-y-2 font-medium mb-4 text-green-900">
            <li>나는 일회용품 사용을 줄이고, 다회용 컵과 텀블러를 적극 사용하겠습니다.</li>
            <li>나는 점심시간 및 퇴근 시 사용하지 않는 전자기기의 전원과 조명을 끄겠습니다.</li>
            <li>나는 가까운 거리는 걷거나 자전거를 이용하고, 대중교통 이용을 생활화하겠습니다.</li>
            <li>나는 냉난방 시 적정 실내온도(여름 28도 이상, 겨울 18도 이하)를 준수하겠습니다.</li>
            <li>나는 페이퍼리스(Paperless) 업무 환경 조성에 적극 동참하겠습니다.</li>
          </ul>
          <p className="mb-5 font-bold text-center text-green-800 break-keep">
            나의 작은 실천이 모여 큰 숲을 이룰 것을 믿으며, 위의 사항들을 일상 속에서 꾸준히 실천할 것을 다짐합니다.
          </p>

          <div className="flex flex-col items-center justify-center mt-6 pt-4 border-t border-green-200/60">
            <span className="text-sm font-bold text-gray-600 mb-1">{todayDate}</span>
            <span className="text-sm font-bold text-gray-600 mb-2">한국승강기안전공단 인천서부지사</span>
            <div className="flex items-center space-x-2 text-lg">
              <span className="text-gray-600">이름</span>
              <span className="font-extrabold text-green-800">{userName}</span>
            </div>
          </div>
        </div>
        
        <label className={`flex items-center justify-center space-x-3 p-4 mb-4 rounded-xl border-2 transition-colors ${isDone ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-white border-green-200 cursor-pointer hover:bg-green-50'}`}>
          <div className={`w-6 h-6 rounded flex items-center justify-center border-2 ${isChecked ? 'bg-green-500 border-green-500' : 'bg-white border-gray-300'}`}>
            {isChecked && <Check className="text-white w-4 h-4" />}
          </div>
          <span className={`font-bold ${isChecked ? 'text-green-700' : 'text-gray-600'}`}>
            {isDone ? '서약에 동의하셨습니다.' : '위 내용에 동의하며 서약합니다.'}
          </span>
          {!isDone && (
            <input 
              type="checkbox" 
              checked={isChecked}
              onChange={() => setIsChecked(!isChecked)}
              className="hidden"
            />
          )}
        </label>
        
        <div className="flex space-x-3 shrink-0">
          {!isDone && (
            <button 
              onClick={onClose} 
              className="flex-1 bg-gray-100 text-gray-600 font-bold py-3.5 rounded-xl hover:bg-gray-200 transition-colors"
            >
              취소
            </button>
          )}
          <button 
            onClick={handleSubmit}
            className={`flex-[2] font-bold py-3.5 rounded-xl transition-colors shadow-md ${isDone ? 'bg-green-600 text-white hover:bg-green-700 w-full' : (isChecked ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-white cursor-not-allowed')}`}
            disabled={!isDone && !isChecked}
          >
            {isDone ? '확인' : '서약 완료하기 (+50P)'}
          </button>
        </div>
      </div>
    </div>
  );
}
