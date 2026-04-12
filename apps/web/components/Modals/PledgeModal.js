'use client';

import { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

export default function PledgeModal({ isOpen, onClose, onConfirm, isDone = false }) {
  const [checks, setChecks] = useState([isDone, isDone, isDone]);

  if (!isOpen) return null;

  const handleCheck = (index) => {
    if (isDone) return;
    const newChecks = [...checks];
    newChecks[index] = !newChecks[index];
    setChecks(newChecks);
  };

  const handleSubmit = () => {
    if (isDone) return;
    if (checks.every(c => c)) {
      onConfirm();
    } else {
      alert('모든 행동 서약 항목에 체크해주세요.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in">
        <h2 className="text-lg font-bold text-center text-green-700 mb-4 flex items-center justify-center">
          <ShieldCheck className="mr-2" /> 에너지지킴이 행동 서약
        </h2>
        <p className="text-xs text-gray-500 text-center mb-5">아래 항목들에 모두 체크하여<br/>에너지지킴이로 활동할 것을 서약해주세요.</p>
        
        <div className="space-y-3 mb-6 text-sm text-gray-700">
          {[
            "나는 사용하지 않는 전자기기의 플러그를 뽑겠습니다.",
            "나는 점심시간 및 퇴근 시 조명과 PC를 끄겠습니다.",
            "나는 적정 실내온도(여름 26도, 겨울 20도)를 준수하겠습니다."
          ].map((text, i) => (
            <label key={i} className={`flex items-start space-x-2 p-3 rounded-lg border transition-colors ${isDone ? 'bg-gray-100 border-gray-200 cursor-default' : 'bg-gray-50 border-gray-200 cursor-pointer hover:bg-green-50'}`}>
              <input 
                type="checkbox" 
                checked={checks[i]}
                onChange={() => handleCheck(i)}
                disabled={isDone}
                className="mt-0.5 text-green-600 w-4 h-4 focus:ring-green-500 rounded" 
              />
              <span className="flex-1 leading-snug">{text}</span>
            </label>
          ))}
        </div>
        
        <button 
          onClick={handleSubmit}
          disabled={isDone}
          className={`w-full font-bold py-3 rounded-xl mb-2 transition-colors shadow-md ${isDone ? 'bg-gray-400 text-white cursor-not-allowed' : 'bg-green-600 text-white hover:bg-green-700'}`}
        >
          {isDone ? '서약 완료 ✅' : '서약 완료하기 (+50P)'}
        </button>
        <button 
          onClick={onClose} 
          className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-300 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
