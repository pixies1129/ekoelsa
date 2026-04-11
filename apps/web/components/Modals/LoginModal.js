'use client';

import { useState } from 'react';
import * as api from '@/lib/api';

export default function LoginModal({ isOpen, onLoginSuccess, onSwitchToRegister }) {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userName || !password) {
      setError('이름과 비밀번호를 모두 입력해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.login(userName, password);
      sessionStorage.setItem('eko_token', response.token);
      onLoginSuccess(userName);
    } catch (err) {
      setError(err.info?.message || '로그인에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center backdrop-blur-md px-4">
      <div className="bg-white w-full max-w-sm rounded-3xl p-8 shadow-2xl animate-in fade-in zoom-in duration-300">
        <div className="flex flex-col items-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-3xl flex items-center justify-center mb-4 shadow-inner">
            <span className="text-4xl">🌱</span>
          </div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">EKO-ELSA</h1>
          <p className="text-sm text-gray-500 font-medium mt-1">인천서부지사 탄소중립 실천</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">사용자 이름</label>
            <input 
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="성명을 입력하세요"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-1.5 ml-1">비밀번호</label>
            <input 
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-gray-50 border-2 border-gray-100 rounded-2xl px-5 py-3.5 text-gray-800 placeholder-gray-300 focus:outline-none focus:border-green-500 focus:bg-white transition-all font-medium"
            />
          </div>

          {error && (
            <div className="bg-red-50 text-red-500 text-xs font-bold p-3.5 rounded-xl flex items-center gap-2 animate-shake">
              <span className="text-base">⚠️</span>
              {error}
            </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'} text-white font-black py-4 rounded-2xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 text-lg`}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              '로그인'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button 
            type="button"
            onClick={onSwitchToRegister}
            className="text-sm text-gray-500 hover:text-green-600 font-bold transition-colors"
          >
            계정이 없으신가요? <span className="underline decoration-2 underline-offset-4">회원가입하기</span>
          </button>
        </div>

        <p className="mt-8 text-center text-xs text-gray-400 font-medium border-t border-gray-100 pt-6">
          본 애플리케이션은 한국승강기안전공단 인천서부지사<br/>임직원 전용 서비스입니다.
        </p>
      </div>
    </div>
  );
}
