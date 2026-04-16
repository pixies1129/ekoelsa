'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

export default function RegisterModal({ isOpen, onRegisterSuccess, onSwitchToLogin }) {
  const [userName, setUserName] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [charType, setCharType] = useState('type1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const characters = [
    { type: 'type1', emoji: '🛢️', name: '원유 방울' },
    { type: 'type2', emoji: '⚡', name: '스마트 전구' },
    { type: 'type3', emoji: '🚀', name: '슈퍼 배터리' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!userName || !empId || !password || !confirmPassword) {
      setError('모든 필드를 입력해주세요.');
      return;
    }

    if (password !== confirmPassword) {
      setError('비밀번호가 일치하지 않습니다.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.onboardUser(userName, empId, charType, password);
      
      // 성공 시 필드 초기화
      setUserName('');
      setEmpId('');
      setPassword('');
      setConfirmPassword('');
      setCharType('type1');
      
      onRegisterSuccess(userName);
    } catch (err) {
      setError(err.info?.error || '회원가입 실패. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-md px-4 overflow-y-auto py-8">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300 my-auto">
        <div className="flex flex-col items-center mb-6">
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">회원가입</h1>
          <p className="text-sm text-gray-500 font-medium mt-1 text-center">함께 시작하는 에너지 절약</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center mb-6">
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">나의 에코 캐릭터 선택</label>
            <div className="flex gap-4">
              {characters.map((char) => (
                <button
                  key={char.type}
                  type="button"
                  onClick={() => setCharType(char.type)}
                  className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                    charType === char.type 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-100 bg-gray-50 grayscale opacity-60'
                  }`}
                >
                  <span className="text-3xl mb-1">{char.emoji}</span>
                  <span className={`text-[10px] font-bold ${charType === char.type ? 'text-green-700' : 'text-gray-400'}`}>
                    {char.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">이름</label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="성명을 입력하세요"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-gray-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">사번</label>
            <input 
              type="text"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              placeholder="사번을 입력하세요"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-gray-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">비밀번호</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-gray-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">비밀번호 확인</label>
            <input 
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3 text-gray-800 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3 rounded-xl flex items-center gap-2">
              <span>⚠️</span> {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2 text-lg`}
          >
            {loading ? '처리 중...' : '회원가입'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors"
          >
            이미 계정이 있으신가요? <span className="underline decoration-2 underline-offset-4">로그인하기</span>
          </button>
        </div>
      </div>
    </div>
  );
}
