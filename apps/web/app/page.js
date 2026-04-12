'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import HomeTab from '@/components/Tabs/HomeTab';
import MissionsTab from '@/components/Tabs/MissionsTab';
import RankingTab from '@/components/Tabs/RankingTab';
import Toast from '@/components/Toast';

import RegisterModal from '@/components/Modals/RegisterModal';
import CharacterModal from '@/components/Modals/CharacterModal';
import PledgeModal from '@/components/Modals/PledgeModal';
import EduModal from '@/components/Modals/EduModal';
import TextInputModal from '@/components/Modals/TextInputModal';
import GrantModal from '@/components/Modals/GrantModal';
import LoginModal from '@/components/Modals/LoginModal';

import * as api from '@/lib/api';

export default function Page() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [user, setUser] = useState(null);
  const [missions, setMissions] = useState([]);
  const [rankings, setRankings] = useState([]);
  const [todayMissions, setTodayMissions] = useState({});
  const [toastMessage, setToastMessage] = useState('');
  
  const [modals, setModals] = useState({
    login: false,
    register: false,
    character: false,
    pledge: false,
    edu: false,
    textInput: false,
    grant: false
  });

  const [pendingTextMission, setPendingTextMission] = useState(null);
  const [pendingCameraMission, setPendingCameraMission] = useState(null);

  useEffect(() => {
    setMounted(true);
    const init = async () => {
      try {
        const [missionsData, rankingsData] = await Promise.all([
          api.fetchMissions(),
          api.getRankings()
        ]);
        setMissions(missionsData);
        setRankings(rankingsData);
      } catch (error) {
        console.error('Failed to fetch initial data:', error);
      }
    };

    init();

    const token = sessionStorage.getItem('eko_token');
    const savedEmpId = localStorage.getItem('eko_empId');

    if (!token || !savedEmpId) {
      setModals(prev => ({ ...prev, login: true }));
    } else {
      loadUserProfile(savedEmpId);
    }

    const savedTodayMissions = localStorage.getItem('eko_todayMissions');
    if (savedTodayMissions) {
      try {
        setTodayMissions(JSON.parse(savedTodayMissions));
      } catch (e) {
        setTodayMissions({});
      }
    }
  }, []);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const missionParam = urlParams.get('mission');
    
    if (missionParam === 'm8' && user && missions.length > 0) {
      // URL 파라미터 즉시 제거하여 새로고침 시 중복 실행 방지
      window.history.replaceState({}, document.title, window.location.pathname);
      
      const today = new Date().toISOString().split('T')[0];
      if (todayMissions['m8'] === today) {
        setToastMessage('오늘 이미 폐배터리 수거 인증을 완료했습니다.');
        return;
      }
      
      const mission = missions.find(m => m.id === 'm8');
      if (mission) {
        handleMissionComplete(mission);
      }
    }
  }, [user, missions, todayMissions]);

  const loadUserProfile = async (empId) => {
    try {
      const profile = await api.getUserProfile(empId);
      setUser(profile);
      refreshRankings();
    } catch (error) {
      console.error('Profile Load Error:', error);
      if (error.status === 401 || error.status === 404) {
        handleLogout();
      }
    }
  };

  const refreshRankings = async () => {
    try {
      const rankingsData = await api.getRankings();
      setRankings(rankingsData);
    } catch (error) {}
  };

  const handleLoginSuccess = (empId, userName) => {
    localStorage.setItem('eko_empId', empId);
    setModals(prev => ({ ...prev, login: false }));
    loadUserProfile(empId);
    setToastMessage(`${userName || empId}님, 환영합니다!`);
  };

  const handleLogout = async () => {
    const token = sessionStorage.getItem('eko_token');
    if (token) {
      try { await api.logout(token); } catch (e) {}
    }
    sessionStorage.removeItem('eko_token');
    localStorage.removeItem('eko_empId');
    setUser(null);
    setModals(prev => ({ ...prev, login: true, register: false }));
    setToastMessage('로그아웃 되었습니다.');
  };

  const handleRegisterSuccess = (userName) => {
    setModals(prev => ({ ...prev, register: false, login: true }));
    setToastMessage(`${userName}님, 회원가입 완료! 이제 로그인해주세요.`);
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0 && pendingCameraMission) {
      handleMissionComplete(pendingCameraMission, '사진 인증 완료');
      setPendingCameraMission(null);
      e.target.value = '';
    }
  };

  const handleMissionComplete = async (mission, content = '인증 완료') => {
    if (!user) return;
    try {
      await api.verifyMission(mission.id, user.empId, content);
      const today = new Date().toISOString().split('T')[0];
      const newTodayMissions = { ...todayMissions, [mission.id]: today };
      setTodayMissions(newTodayMissions);
      localStorage.setItem('eko_todayMissions', JSON.stringify(newTodayMissions));
      setToastMessage(`[${mission.title}] 미션 완료!\n${mission.points}P 및 탄소저감량 ${mission.carbon}kg 적립완료 🌱`);
      loadUserProfile(user.empId);
    } catch (error) {
      if (error.status === 400 && error.info?.error?.includes('오늘 이미')) {
        setToastMessage('오늘 이미 완료한 미션입니다.');
      } else {
        setToastMessage(error.info?.error || '미션 인증에 실패했습니다.');
      }
    }
  };

  const handlePledge = () => {
    if (!user) return;
    handleMissionComplete({ id: 'pledge', title: '에너지지킴이 서약', points: 50, carbon: 1.0 }, '행동 서약 완료');
    setModals(prev => ({ ...prev, pledge: false }));
  };

  const handleGrant = async (targetEmpId, points) => {
    if (!user) return;
    try {
      await api.giftPoints(targetEmpId, points);
      setToastMessage(`${targetEmpId}님에게 ${points}P가 지급되었습니다!`);
      setModals(prev => ({ ...prev, grant: false }));
      loadUserProfile(user.empId);
    } catch (error) {
      setToastMessage(error.info?.error || '포인트 지급에 실패했습니다.');
    }
  };

  const handleSelectCharacter = async (type) => {
    if (!user) return;
    setUser(prev => ({ ...prev, charType: type }));
    setModals(prev => ({ ...prev, character: false }));
    setToastMessage('캐릭터가 변경되었습니다.');
  };

  return (
    <div className="w-full max-w-md bg-white app-container sm:rounded-[2.5rem] shadow-2xl relative flex flex-col overflow-hidden sm:border-[6px] sm:border-gray-200" suppressHydrationWarning>
      {mounted ? (
        <>
          <Header onLogout={handleLogout} />
          <main className="flex-1 overflow-y-auto pb-6">
            {user ? (
              <>
                {activeTab === 'home' && (
                  <HomeTab 
                    profile={user} 
                    onOpenCharacterModal={() => setModals(prev => ({ ...prev, character: true }))}
                    onOpenEduModal={() => setModals(prev => ({ ...prev, edu: true }))}
                  />
                )}
                {activeTab === 'missions' && (
                  <MissionsTab 
                    missions={missions}
                    todayMissions={todayMissions}
                    pledgeDone={user?.pledgeDone}
                    onOpenPledgeModal={() => setModals(prev => ({ ...prev, pledge: true }))}
                    onTriggerCamera={(id, title, points, carbon) => {
                      setPendingCameraMission({ id, title, points, carbon });
                      document.getElementById('camera-input')?.click();
                    }}
                    onHandleTextMission={(id, title, points, carbon) => {
                      setPendingTextMission({ id, title, points, carbon });
                      setModals(prev => ({ ...prev, textInput: true }));
                    }}
                    onQrClick={() => setToastMessage('스마트폰 기본 카메라 앱을 열고 장비실에 부착된 QR코드를 스캔해주세요!')}
                  />
                )}
                {activeTab === 'forest' && (
                  <RankingTab 
                    rankings={rankings}
                    onOpenGrantModal={() => setModals(prev => ({ ...prev, grant: true }))}
                  />
                )}
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center h-full text-gray-400 text-sm">
                로그인이 필요합니다.
              </div>
            )}
          </main>
          <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
          
          <RegisterModal 
            isOpen={modals.register} 
            onRegisterSuccess={handleRegisterSuccess} 
            onSwitchToLogin={() => setModals(prev => ({ ...prev, login: true, register: false }))}
          />
          <LoginModal 
            isOpen={modals.login}
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setModals(prev => ({ ...prev, login: false, register: true }))}
          />

          {user && (
            <>
              <CharacterModal 
                isOpen={modals.character} 
                currentChar={user?.charType}
                onClose={() => setModals(prev => ({ ...prev, character: false }))}
                onSelect={handleSelectCharacter}
              />
              <PledgeModal 
                isOpen={modals.pledge}
                isDone={user?.pledgeDone}
                onClose={() => setModals(prev => ({ ...prev, pledge: false }))}
                onConfirm={handlePledge}
              />
              <EduModal 
                isOpen={modals.edu}
                onClose={() => setModals(prev => ({ ...prev, edu: false }))}
              />
              <TextInputModal 
                isOpen={modals.textInput}
                title={pendingTextMission?.title}
                desc={pendingTextMission?.id === 'm4' ? '어떤 페이퍼리스 활동을 하셨나요?\n(예: 태블릿으로 회의 참석, 이면지 사용 등)' : '활동 내용을 입력해주세요.'}
                onClose={() => setModals(prev => ({ ...prev, textInput: false }))}
                onSubmit={(content) => {
                  handleMissionComplete(pendingTextMission, content);
                  setModals(prev => ({ ...prev, textInput: false }));
                }}
              />
              <GrantModal 
                isOpen={modals.grant}
                onClose={() => setModals(prev => ({ ...prev, grant: false }))}
                onSubmit={handleGrant}
              />
            </>
          )}
          <Toast message={toastMessage} onClose={() => setToastMessage('')} />
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-white h-full">
          <div className="animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 bg-green-100 rounded-full mb-4"></div>
            <div className="h-4 w-24 bg-gray-100 rounded"></div>
          </div>
        </div>
      )}

      <input 
        type="file" 
        id="camera-input" 
        accept="image/*" 
        capture="environment" 
        className="hidden" 
        onChange={handleFileChange} 
      />
    </div>
  );
}
