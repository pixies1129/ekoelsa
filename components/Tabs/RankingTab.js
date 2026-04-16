'use client';

import { Trophy, Gift, RotateCcw, UserMinus } from 'lucide-react';
import * as api from '@/lib/api';

export default function RankingTab({ rankings, onOpenGrantModal, currentUserEmpId, onRefresh }) {
  const safeTotal = rankings.reduce((sum, user) => sum + (user.carbonSaved || 0), 0);
  const equivalentOil = (safeTotal * 0.4).toFixed(1);

  const isAdmin = currentUserEmpId === '20220055';

  const getLevelEmoji = (points) => {
    if (points < 1000) return '🌱';
    if (points < 2000) return '🌿';
    if (points < 3000) return '🪴';
    return '🌳';
  };

  const handleReset = async (user) => {
    if (!confirm(`${user.userName}님의 포인트와 에너저 절감량을 초기화하시겠습니까?`)) return;
    try {
      await api.adminResetUser(user.empId);
      alert('초기화되었습니다.');
      if (onRefresh) onRefresh();
    } catch (e) {
      alert('초기화 실패: ' + (e.info?.error || e.message));
    }
  };

  const handleDelete = async (user) => {
    if (!confirm(`${user.userName}님을 강제 탈퇴시키겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) return;
    try {
      await api.adminDeleteUser(user.empId);
      alert('삭제되었습니다.');
      if (onRefresh) onRefresh();
    } catch (e) {
      alert('삭제 실패: ' + (e.info?.error || e.message));
    }
  };

  return (
    <div className="p-6 space-y-6 animate-in pb-12">
      <div className="bg-blue-50 rounded-2xl p-5 shadow-sm border border-blue-200 flex items-center justify-between">
        <div className="pr-2 flex-1">
          <h2 className="font-extrabold text-blue-800 text-lg mb-1">수입 원유 절감 효과</h2>
          <p className="text-[11px] text-blue-600 leading-relaxed mb-3">
            탄소저감 1kg당<br/>
            (약 400mL의 원유 수입 대체 효과 발생)
          </p>
          <div className="bg-white/50 py-2 px-3 rounded-xl border border-blue-100 inline-block">
            <span className="text-[14px] font-bold text-gray-700">지사 총 탄소저감량 </span>
            <span className="text-[17px] font-black text-blue-700 ml-1">약 {safeTotal.toFixed(2)} kg</span>
          </div>
        </div>
        <div className="flex flex-col items-center ml-2">
          <span className="text-5xl mb-2">🛢️</span>
          <span className="font-extrabold text-sm text-blue-700 bg-white px-3 py-1.5 rounded-full shadow-md whitespace-nowrap">
            원유 약 {equivalentOil} L 절감
          </span>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-end mb-4">
          <h3 className="text-lg font-bold text-gray-800 flex items-center">
            <Trophy className="mr-2 text-yellow-500 w-5 h-5" />지사원 랭킹
          </h3>
          {isAdmin && (
            <button onClick={onOpenGrantModal} className="text-[10px] bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-lg border border-indigo-100 font-bold hover:bg-indigo-100 transition-colors flex items-center cursor-pointer">
              <Gift className="w-3 h-3 mr-1" />포인트 지급
            </button>
          )}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {rankings.map((user, idx) => (
            <div key={user.empId || user.userName} className={`flex items-center justify-between p-4 ${idx === 0 ? 'bg-green-50 border-b border-gray-100' : 'border-b border-gray-50 last:border-0'}`}>
              <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mr-3 ${idx === 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-100 text-gray-500'}`}>{idx + 1}</div>
                <div>
                  <div className="font-bold text-gray-800 text-sm">{user.userName}</div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                {isAdmin && (
                  <div className="flex space-x-1">
                    <button 
                      onClick={() => handleReset(user)}
                      className="p-1.5 text-gray-400 hover:text-orange-500 hover:bg-orange-50 rounded-md transition-colors"
                      title="초기화"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                    {user.empId !== currentUserEmpId && (
                      <button 
                        onClick={() => handleDelete(user)}
                        className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors"
                        title="강제탈퇴"
                      >
                        <UserMinus className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}
                <div className="text-right">
                  <div className="font-bold text-green-600 text-sm">{user.points}P</div>
                  <div className="text-lg leading-none">{getLevelEmoji(user.points)}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
