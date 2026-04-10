'use client';

import { Home, CheckSquare, Trophy } from 'lucide-react';

export default function BottomNav({ activeTab, onTabChange }) {
  const tabs = [
    { id: 'home', label: '홈', icon: Home, activeColor: 'text-emerald-600', iconColor: '#059669', iconBg: '#d1fae5' },
    { id: 'missions', label: '미션', icon: CheckSquare, activeColor: 'text-blue-600', iconColor: '#2563eb', iconBg: '#dbeafe' },
    { id: 'forest', label: '랭킹', icon: Trophy, activeColor: 'text-orange-500', iconColor: '#f97316', iconBg: '#ffedd5' },
  ];

  return (
    <nav className="w-full bg-white border-t border-gray-100 px-6 py-3 flex justify-between pb-8 sm:pb-5 shrink-0 relative z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)]">
      {tabs.map(({ id, label, icon: Icon, activeColor, iconColor, iconBg }) => (
        <button
          key={id}
          onClick={() => onTabChange(id)}
          className={`flex flex-col items-center flex-1 transition-all ${
            activeTab === id ? `${activeColor} scale-105` : 'text-gray-400 hover:text-gray-500 cursor-pointer'
          }`}
        >
          {activeTab === id ? (
            <Icon 
              className="w-6 h-6 mb-1 drop-shadow-sm" 
              fill={iconBg}
              color={iconColor}
              strokeWidth={2.5}
            />
          ) : (
            <Icon className="w-6 h-6 mb-1 opacity-70" strokeWidth={2} />
          )}
          <span className={`text-[10px] ${activeTab === id ? 'font-extrabold text-[11px]' : 'font-medium'}`}>{label}</span>
        </button>
      ))}
    </nav>
  );
}
