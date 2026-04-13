'use client';

import { X, CheckCircle, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const eduData = [
  {
    day: 1,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 2,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 3,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 4,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 5,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 6,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 7,
    title: "메일함 청소로 디지털 탄소 발자국 지우기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 열기를 높입니다. 메일 1통당 약 4g의 탄소가 배출된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 해결책입니다."
  },
  {
    day: 8,
    title: "냉난방 온도 2도 조절의 마법 🌡️",
    desc: "여름엔 2도 높게, 겨울엔 2도 낮게 설정하는 것만으로도 에너지 소비를 15% 이상 줄일 수 있습니다. 우리 몸도 급격한 온도 차에서 보호받을 수 있어요.",
    action: "사무실 냉난방 온도를 정부 권장 적정 온도(여름 26도, 겨울 20도)에 맞춰 설정해 보세요.",
    tip: "여름엔 시원한 캐주얼, 겨울엔 내복이나 가디건을 활용해 체온을 조절하세요."
  },
  {
    day: 9,
    title: "퇴근길, '전기 흡혈귀' 콘센트 뽑기 🔌",
    desc: "사용하지 않는 가전제품의 대기 전력은 전체 가전 에너지의 10%를 차지합니다. 특히 사무실 내 개인용 충전기나 선풍기 등을 확인해 주세요.",
    action: "퇴근 전, 내 자리 근처의 멀티탭 스위치를 끄거나 콘센트를 뽑아주세요.",
    tip: "USB 허브나 충전 케이블은 기기가 연결되어 있지 않아도 전력을 소비합니다."
  },
  {
    day: 10,
    title: "올바른 분리배출, 자원의 선순환 ♻️",
    desc: "검사 현장에서 나온 폐기물이나 사무실 쓰레기를 제대로 버리는 것도 탄소 중립입니다. 이물질이 묻은 플라스틱은 재활용되지 않고 탄소를 내뿜으며 소각됩니다.",
    action: "배달 음식 용기나 음료병을 버릴 때 '비우고, 헹구고, 분리하기' 3원칙을 지켜보세요.",
    tip: "라벨 제거가 안 된 페트병은 재활용 품질을 떨어뜨리니 꼭 라벨을 떼서 비닐전용함에 버려주세요."
  }
];

export default function EduModal({ isOpen, onClose }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    if (isOpen) {
      const randomIndex = Math.floor(Math.random() * eduData.length);
      setData(eduData[randomIndex]);
    }
  }, [isOpen]);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors">
          <X className="w-6 h-6" />
        </button>
        <div className="mt-2">
          <div className="text-center mb-4">
            <span className="bg-green-100 text-green-800 text-[10px] font-bold px-3 py-1.5 rounded-full">📅 매일 실천하기</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-3 text-center leading-snug break-keep">{data.title}</h3>
          <p className="text-sm text-gray-600 mb-5 bg-gray-50 p-3.5 rounded-xl border border-gray-100 leading-relaxed break-keep">{data.desc}</p>
          
          <div className="mb-4">
            <h4 className="text-xs font-bold text-green-700 mb-1.5 flex items-center"><CheckCircle className="w-4 h-4 mr-1" /> 액션</h4>
            <p className="text-sm text-gray-700 leading-relaxed break-keep">{data.action}</p>
          </div>
          
          <div className="bg-blue-50 p-3.5 rounded-xl border border-blue-100">
            <h4 className="text-xs font-bold text-blue-700 mb-1.5 flex items-center"><Lightbulb className="w-4 h-4 mr-1" /> 한 줄 팁</h4>
            <p className="text-xs text-gray-700 leading-relaxed break-keep">{data.tip}</p>
          </div>
        </div>
        <div className="mt-6">
          <button onClick={onClose} className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white transition-colors rounded-xl text-sm font-bold shadow-md">확인</button>
        </div>
      </div>
    </div>
  );
}
