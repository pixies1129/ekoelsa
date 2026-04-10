'use client';

import { useState } from 'react';

export default function OnboardingModal({ isOpen, onSave }) {
  const [userName, setUserName] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (!userName.trim()) {
      alert('이름을 입력해주세요.');
      return;
    }
    onSave(userName.trim());
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in">
        <div className="flex justify-center mb-4"><span className="text-5xl">🌱</span></div>
        <h2 className="text-xl font-bold text-center text-gray-800 mb-2">환영합니다!</h2>
        <p className="text-sm text-gray-500 text-center mb-6">EKO-ELSA에서 사용할 이름을 입력해주세요.</p>
        <input 
          type="text" 
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-green-500" 
          placeholder="이름 입력 (예: 홍길동)" 
        />
        <button 
          onClick={handleSave}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl hover:bg-green-700 transition-colors"
        >
          시작하기
        </button>
      </div>
    </div>
  );
}
