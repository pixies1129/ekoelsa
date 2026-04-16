'use client';

import { X, CheckCircle, Lightbulb } from 'lucide-react';
import { useState, useEffect } from 'react';

const eduData = [
  {
    day: 1,
    title: "메일함 청소로 디지털 에너지 낭비 줄이기 📧",
    desc: "불필요한 스팸 메일과 오래된 업무 메일은 데이터 센터의 전력 소비를 높여 원유 소모를 촉진합니다. 메일 1통당 저장과 전송에 상당한 에너지가 소모된다는 사실, 알고 계셨나요?",
    action: "퇴근 전, 받은 메일함의 광고성 메일이나 오래된 첨부파일 10개만 삭제해 보세요.",
    tip: "읽지 않는 뉴스레터는 '구독 취소'를 하는 것이 근본적인 에너지 절약 방법입니다."
  },
  {
    day: 2,
    title: "건강과 에너지 절약을 동시에! 계단 이용하기 🏃‍♂️",
    desc: "엘리베이터 대신 계단을 이용하면 수입 원유로 생산된 전력 소비를 직접적으로 줄일 수 있습니다. 매일 5층만 걸어도 건물의 전체 에너지 효율을 높이는 효과가 있습니다.",
    action: "출근 시나 점심시간 이동 때 3층 이하의 낮은 층수는 계단을 이용해 보세요.",
    tip: "계단 오르기는 하체 근력 강화와 심폐 기능 향상에도 탁월한 운동입니다."
  },
  {
    day: 3,
    title: "대중교통 이용으로 원유 수입 의존도 낮추기 🚌",
    desc: "승용차 대신 버스나 지하철을 이용하면 도로 위 에너지 소비량을 90% 이상 줄일 수 있습니다. 소중한 자원인 원유를 아끼고 교통 혼잡도 해결해 보세요.",
    action: "일주일에 하루는 '차 없는 날'로 지정하여 버스나 지하철로 출근해 보세요.",
    tip: "대중교통을 이용하며 독서를 하거나 음악을 들으며 나만의 시간을 가져보세요."
  },
  {
    day: 4,
    title: "일회용 컵 대신 나만의 텀블러 사용하기 ☕",
    desc: "플라스틱과 종이컵 제작에는 막대한 양의 원유와 에너지가 투입됩니다. 텀블러를 생활화하면 불필요한 자원 낭비를 막고 제조 공정의 에너지 소비를 줄일 수 있습니다.",
    action: "사무실 내에서는 종이컵 대신 개인 컵이나 텀블러를 상시 사용해 보세요.",
    tip: "많은 카페에서 텀블러 사용 시 음료 가격 할인 혜택을 제공하고 있습니다."
  },
  {
    day: 5,
    title: "종이 없는 스마트한 사무 환경, 에너지 세이빙 📑",
    desc: "A4 용지 제작 공정은 전력과 용수 사용량이 매우 높은 에너지 집약적 산업입니다. 디지털 기기를 활용한 보고는 제조에 필요한 원유와 에너지를 아끼는 가장 빠른 방법입니다.",
    action: "회의 시 자료를 출력하는 대신 태블릿이나 노트북으로 공유하여 확인해 보세요.",
    tip: "이면지 활용함을 만들어 인쇄 실수를 줄이고 종이 사용을 최소화하세요."
  },
  {
    day: 6,
    title: "깨끗한 환경이 곧 에너지! 동네 '줍깅' ☘️",
    desc: "길가의 쓰레기를 수거하는 것은 자원 재활용률을 높여 새로운 제품을 만들 때 필요한 에너지를 절약하게 해줍니다. 오염을 막는 것이 곧 자원을 보존하는 일입니다.",
    action: "퇴근 길이나 주말 산책 때 작은 봉투를 챙겨 눈에 보이는 쓰레기 3개만 주워보세요.",
    tip: "쓰레기를 주울 때는 무릎을 굽혔다 펴는 동작을 통해 하체 운동 효과도 볼 수 있습니다."
  },
  {
    day: 7,
    title: "냉난방 온도 2도 조절로 원유 사용량 줄이기 🌡️",
    desc: "여름엔 2도 높게, 겨울엔 2도 낮게 설정하는 것만으로도 건물 전체 에너지 소비를 15% 이상 줄여 원유 수입을 아낄 수 있습니다. 우리 몸도 적정 온도에서 더 건강해집니다.",
    action: "사무실 냉난방 온도를 공단 권장 적정 온도(여름 28도 이상, 겨울 18도 이하)에 맞춰 설정해 보세요.",
    tip: "여름엔 시원한 캐주얼, 겨울엔 내복이나 가디건을 활용해 체온을 조절하세요."
  },
  {
    day: 8,
    title: "퇴근길, '전기 도둑' 콘센트 뽑기 🔌",
    desc: "사용하지 않는 가전제품의 대기 전력은 국가 전체 가전 에너지의 10%를 차지하며, 이는 곧 버려지는 원유와 같습니다. 사무실 내 개인 기기 전원을 꼭 확인해 주세요.",
    action: "퇴근 전, 내 자리 근처의 멀티탭 스위치를 끄거나 콘센트를 뽑아주세요.",
    tip: "USB 허브나 충전 케이블은 기기가 연결되어 있지 않아도 미세하게 전력을 소비합니다."
  },
  {
    day: 9,
    title: "올바른 분리배출로 만드는 에너지 선순환 ♻️",
    desc: "제대로 된 분리배출은 폐기물 소각 시 발생하는 에너지 손실을 막고, 재활용 공정의 효율을 높여 원유 기반 원료 사용을 줄여줍니다. 비우고 헹구는 습관이 에너지가 됩니다.",
    action: "배달 음식 용기나 음료병을 버릴 때 '비우고, 헹구고, 분리하기' 3원칙을 지켜보세요.",
    tip: "라벨 제거가 안 된 페트병은 재활용 품질을 떨어뜨리니 꼭 라벨을 떼서 버려주세요."
  },
  {
    day: 10,
    title: "폐건전지 수거로 귀중한 금속 자원 회수 🔋",
    desc: "다 쓴 건전지를 분리 배출하면 철, 아연, 망간 등 수입에 의존하는 금속을 회수할 수 있어, 새로운 광물을 채굴하고 운반하는 데 드는 막대한 에너지를 절약할 수 있습니다.",
    action: "다 쓴 건전지를 모아두었다가 전용 수거함이나 지사의 수거 거점에 배출해 주세요.",
    tip: "건전지 수거함은 보통 아파트 단지 입구나 주민센터 등에 비치되어 있습니다."
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
