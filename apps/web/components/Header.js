'use client';

import { Leaf } from 'lucide-react';

export default function Header() {
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
        <img src="https://i.ibb.co/TdGttdp/ci.png" alt="한국승강기안전공단 로고" className="h-8 object-contain mt-1.5" referrerPolicy="no-referrer" />
      </div>
    </header>
  );
}
