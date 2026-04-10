'use client';

import { Trophy, Gift } from 'lucide-react';

export default function RankingTab({ rankings, onOpenGrantModal }) {
  const safeTotal = rankings.reduce((sum, user) => sum + (user.carbonSaved || 0), 0);
  const equivalentTrees = (safeTotal / 6.6).toFixed(1);

  const getLevelEmoji = (points) => {
    if (points < 1000) return '🌱';
    if (points < 2000) return '🌿';
    if (points < 3000) return '🪴';
    return '🌳';
  };

  return (
    <div className="p-6 space-y-6 animate-in pb-12">
      <div className="bg-green-50 rounded-2xl p-5 shadow-sm border border-green-200 flex items-center justify-between">
        <div className="pr-2">
          <h2 className="font-extrabold text-green-800 text-base mb-1">실제 나무 심기 효과</h2>
          <p className="text-[10px] text-green-600">국립산림과학원 기준</p>
          <p className="text-xs text-gray-600 mt-1">지사 총 탄소저감: {safeTotal.toFixed(1)}kg</p>
        </div>
        <div className="flex flex-col items-center">
          <span className="text-3xl mb-1">🌲</span>
          <span className="font-extrabold text-sm text-green-700 bg-white px-2 py-1 rounded-full shadow-sm whitespace-nowrap">
            약 {equivalentTrees} 그루
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Trophy className="mr-2 text-yellow-500 w-5 h-5" />지사원 랭킹
          </h3>
          <button onClick={onOpenGrantModal} className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 font-bold hover:bg-indigo-100 transition-colors flex items-center cursor-pointer">
            <Gift className="w-3 h-3 mr-1" />포인트 지급/선물
          </button>
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {rankings.map((user, idx) => (
            <div key={user.userName} className={`flex items-center justify-between p-4 ${idx === 0 ? 'bg-green-50 border-b border-gray-100' : 'border-b border-gray-50 last:border-0'}`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{idx + 1}</div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{user.userName}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-green-600">{user.points}P</div>
                <div className="text-lg">{getLevelEmoji(user.points)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
