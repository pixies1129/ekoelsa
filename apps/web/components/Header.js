'use client';

import { Leaf, LogOut } from 'lucide-react';

export default function Header({ onLogout }) {
  return (
    <header className="bg-white pt-12 sm:pt-8 pb-4 px-6 shrink-0 z-10 border-b border-gray-100">
      <div className="flex justify-between items-start">
        <div className="pt-1">
          <h1 className="text-2xl font-extrabold text-green-700 tracking-tight flex items-center leading-none">
            <Leaf className="mr-1.5 w-6 h-6" />
            EKO-ELSA
          </h1>
          <p className="text-xs text-gray-500 mt-1.5 ml-1">인천서부지사</p>
        </div>
        <div className="flex flex-col items-end gap-1.5 mt-1.5">
          <img src="https://i.ibb.co/TdGttdp/ci.png" alt="한국승강기안전공단 로고" className="h-7 object-contain" referrerPolicy="no-referrer" />
          <button 
            onClick={onLogout}
            className="text-[9px] font-bold text-gray-400 hover:text-red-500 transition-all cursor-pointer px-1"
          >
            로그아웃
          </button>
        </div>
      </div>
    </header>
  );
}
