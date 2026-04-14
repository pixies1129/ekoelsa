'use client';

import { Leaf, LogOut } from 'lucide-react';

export default function Header({ onLogout, onDeleteAccount }) {
  return (
    <header className="bg-white pt-12 sm:pt-8 pb-4 px-6 shrink-0 z-10 border-b border-gray-100" suppressHydrationWarning>
      <div className="flex justify-between items-start" suppressHydrationWarning>
        <div className="pt-1" suppressHydrationWarning>
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight flex items-center leading-none" suppressHydrationWarning>
            <Leaf className="mr-1.5 w-6 h-6" />
            EKO-ELSA
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 ml-1" suppressHydrationWarning>인천서부지사</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 mt-1.5" suppressHydrationWarning>
          <img src="https://i.ibb.co/TdGttdp/ci.png" alt="한국승강기안전공단 로고" className="h-7 object-contain" referrerPolicy="no-referrer" suppressHydrationWarning />
          <div className="flex items-center space-x-2 mt-1" suppressHydrationWarning>
            <button 
              onClick={onLogout}
              className="text-[10px] font-bold text-gray-400 hover:text-green-600 transition-colors cursor-pointer px-1"
              suppressHydrationWarning
            >
              로그아웃
            </button>
            <span className="text-gray-300 text-[10px]" suppressHydrationWarning>|</span>
            <button 
              onClick={onDeleteAccount}
              className="text-[10px] font-bold text-gray-400 hover:text-red-500 transition-colors cursor-pointer px-1"
              suppressHydrationWarning
            >
              탈퇴하기
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
