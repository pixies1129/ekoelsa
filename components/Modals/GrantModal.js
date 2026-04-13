'use client';

import { useState, useEffect } from 'react';
import { Gift } from 'lucide-react';

export default function GrantModal({ isOpen, onClose, onSubmit }) {
  const [empId, setEmpId] = useState('');
  const [points, setPoints] = useState('');

  useEffect(() => {
    if (isOpen) {
      setEmpId('');
      setPoints('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const p = parseInt(points);
    if (!empId.trim()) {
      alert('사번을 입력해주세요.');
      return;
    }
    if (isNaN(p) || p <= 0) {
      alert('올바른 포인트 숫자를 입력해주세요.');
      return;
    }
    onSubmit(empId.trim(), p);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-4 flex items-center justify-center">
          <Gift className="mr-2 text-indigo-500 w-5 h-5" />포인트 선물하기
        </h2>
        <input 
          type="text" 
          value={empId}
          onChange={(e) => setEmpId(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-3 focus:outline-none focus:border-indigo-500" 
          placeholder="받을 지사원 사번 (본인은 '나')" 
        />
        <input 
          type="number" 
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-5 focus:outline-none focus:border-indigo-500" 
          placeholder="지급할 포인트 (숫자만 입력)" 
        />
        <button 
          onClick={handleSubmit}
          className="w-full bg-indigo-600 text-white font-bold py-3 rounded-xl mb-2 hover:bg-indigo-700 transition-colors"
        >
          포인트 지급
        </button>
        <button 
          onClick={onClose}
          className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-300 transition-colors"
        >
          취소
        </button>
      </div>
    </div>
  );
}
