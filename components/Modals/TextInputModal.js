'use client';

import { useState, useEffect } from 'react';

export default function TextInputModal({ isOpen, onClose, onSubmit, title, desc }) {
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setText('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (text.trim().length > 0) {
      onSubmit(text.trim());
    } else {
      alert('내용을 입력해야 인증이 완료됩니다.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-2">{title || '인증하기'}</h2>
        <p className="text-xs text-gray-500 text-center mb-4 whitespace-pre-wrap">{desc || '내용을 입력해주세요.'}</p>
        <textarea 
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 mb-4 focus:outline-none focus:border-green-500 resize-none" 
          rows="3" 
          placeholder="여기에 작성해주세요"
        ></textarea>
        <button 
          onClick={handleSubmit}
          className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mb-2 hover:bg-green-700 transition-colors"
        >
          인증 완료
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
