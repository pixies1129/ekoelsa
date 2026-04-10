'use client';

import { Home, CheckSquare, Trophy } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home },
    { id: 'missions', label: '미션', icon: CheckSquare },
    { id: 'forest', label: '랭킹', icon: Trophy },
  ];

  return (
    <nav className="w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between pb-8 sm:pb-5 shrink-0 relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      {tabs.map(({ id, label, icon: Icon }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center flex-1 transition-all ${
            activeTab === id ? 'text-green-600 scale-105' : 'text-gray-400'
          }`}
        >
          <Icon className={`w-6 h-6 mb-1 ${activeTab === id ? 'stroke-[2.5px]' : 'stroke-2'}`} />
          <span className={`text-[10px] ${activeTab === id ? 'font-extrabold' : 'font-medium'}`}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
