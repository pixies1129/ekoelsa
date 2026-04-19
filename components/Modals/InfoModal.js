'use client';

import { X, Info } from 'lucide-react';

export default function InfoModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1.5 bg-blue-500"></div>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
        
        <div className="flex items-center mb-5 mt-2">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <h2 className="text-lg font-bold text-gray-800">산출 근거 및 방식</h2>
        </div>

        <div className="space-y-4">
          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">기준 데이터</h3>
            <p className="text-sm text-gray-700 leading-relaxed break-keep font-medium">
              환경부 온실가스 배출계수 및 <br/>
              <span className="text-blue-600 font-bold">에너지경제연구원 석유환산톤(TOE)</span> 기준
            </p>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">핵심 수치</h3>
            <p className="text-sm text-gray-700 leading-relaxed font-medium">
              원유 1ℓ 연소 시 발생하는 CO₂는 <br/>
              <span className="text-gray-900 font-bold">평균 2.63kg</span>
            </p>
          </div>

          <div className="border-b border-gray-100 pb-3">
            <h3 className="text-[11px] font-bold text-gray-400 mb-1.5 uppercase tracking-wider">계산 방식</h3>
            <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-center">
              <code className="text-[15px] font-black text-blue-700">
                1kg(CO₂) ÷ 2.63kg/ℓ ≈ 0.38ℓ
              </code>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
            <h3 className="text-[11px] font-bold text-blue-500 mb-1.5 uppercase tracking-wider">최종 표기</h3>
            <p className="text-[13px] text-blue-900 leading-relaxed break-keep font-semibold">
              사용자 이해를 돕기 위해 <br/>
              약 <span className="text-[16px] text-blue-700 font-black underline decoration-blue-300 underline-offset-4">**400mℓ**</span>로 표기
            </p>
          </div>
        </div>

        <div className="mt-7">
          <button 
            onClick={onClose} 
            className="w-full px-4 py-3 bg-gray-800 hover:bg-gray-900 text-white transition-colors rounded-xl text-sm font-bold shadow-lg shadow-gray-200"
          >
            확인했습니다
          </button>
        </div>
      </div>
    </div>
  );
}
