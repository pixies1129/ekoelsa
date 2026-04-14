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
    title: "건강과 환경을 동시에! 계단 이용하기 🏃‍♂️",
    desc: "엘리베이터 대신 계단을 이용하면 1층당 약 12.7g의 탄소 배출을 줄일 수 있습니다. 매일 5층만 걸어도 나무 한 그루를 심는 효과가 있습니다.",
    action: "출근 시나 점심시간 이동 때 3층 이하의 낮은 층수는 계단을 이용해 보세요.",
    tip: "계단 오르기는 하체 근력 강화와 심폐 기능 향상에도 탁월한 운동입니다."
  },
  {
    day: 3,
    title: "대중교통 이용으로 탄소 다이어트 🚌",
    desc: "승용차 대신 버스나 지하철을 이용하면 탄소 배출량을 90% 이상 줄일 수 있습니다. 혼잡한 출퇴근길, 지구도 숨을 쉴 수 있게 도와주세요.",
    action: "일주일에 하루는 '차 없는 날'로 지정하여 버스나 지하철로 출근해 보세요.",
    tip: "대중교통을 이용하며 독서를 하거나 음악을 들으며 나만의 시간을 가져보세요."
  },
  {
    day: 4,
    title: "일회용 컵 대신 나만의 텀블러 사용하기 ☕",
    desc: "우리나라에서 버려지는 일회용 컵은 연간 280억 개에 달합니다. 텀블러를 6개월 이상 사용하면 일회용 컵보다 탄소 배출량이 훨씬 적어집니다.",
    action: "사무실 내에서는 종이컵 대신 개인 컵이나 텀블러를 상시 사용해 보세요.",
    tip: "많은 카페에서 텀블러 사용 시 음료 가격 할인 혜택을 제공하고 있습니다."
  },
  {
    day: 5,
    title: "종이 없는 스마트한 사무 환경, 페이퍼리스 📑",
    desc: "A4 용지 한 장을 만드는 데 10L의 물이 쓰이고 2.88g의 탄소가 발생합니다. 디지털 기기를 활용한 보고는 숲을 보호하는 가장 빠른 방법입니다.",
    action: "회의 시 자료를 출력하는 대신 태블릿이나 노트북으로 공유하여 확인해 보세요.",
    tip: "이면지 활용함을 만들어 인쇄 실수를 줄이고 종이 사용을 최소화하세요."
  },
  {
    day: 6,
    title: "동네를 산책하며 지구를 닦는 '줍깅' ☘️",
    desc: "조깅하며 쓰레기를 줍는 '줍깅(플로깅)'은 환경 보호와 운동을 결합한 실천입니다. 길가의 쓰레기가 강으로 흘러가 해양 오염이 되는 것을 막아줍니다.",
    action: "퇴근 길이나 주말 산책 때 작은 봉투를 챙겨 눈에 보이는 쓰레기 3개만 주워보세요.",
    tip: "쓰레기를 주울 때는 무릎을 굽혔다 펴는 동작을 통해 하체 운동 효과도 볼 수 있습니다."
  },
  {
    day: 7,
    title: "냉난방 온도 2도 조절의 마법 🌡️",
    desc: "여름엔 2도 높게, 겨울엔 2도 낮게 설정하는 것만으로도 에너지 소비를 15% 이상 줄일 수 있습니다. 우리 몸도 급격한 온도 차에서 보호받을 수 있어요.",
    action: "사무실 냉난방 온도를 공단 권장 적정 온도(여름 28도 이상, 겨울 18도 이하)에 맞춰 설정해 보세요.",
    tip: "여름엔 시원한 캐주얼, 겨울엔 내복이나 가디건을 활용해 체온을 조절하세요."
  },
  {
    day: 8,
    title: "퇴근길, '전기 흡혈귀' 콘센트 뽑기 🔌",
    desc: "사용하지 않는 가전제품의 대기 전력은 전체 가전 에너지의 10%를 차지합니다. 특히 사무실 내 개인용 충전기나 선풍기 등을 확인해 주세요.",
    action: "퇴근 전, 내 자리 근처의 멀티탭 스위치를 끄거나 콘센트를 뽑아주세요.",
    tip: "USB 허브나 충전 케이블은 기기가 연결되어 있지 않아도 전력을 소비합니다."
  },
  {
    day: 9,
    title: "올바른 분리배출, 자원의 선순환 ♻️",
    desc: "검사 현장에서 나온 폐기물이나 사무실 쓰레기를 제대로 버리는 것도 탄소 중립입니다. 이물질이 묻은 플라스틱은 재활용되지 않고 탄소를 내뿜으며 소각됩니다.",
    action: "배달 음식 용기나 음료병을 버릴 때 '비우고, 헹구고, 분리하기' 3원칙을 지켜보세요.",
    tip: "라벨 제거가 안 된 페트병은 재활용 품질을 떨어뜨리니 꼭 라벨을 떼서 비닐전용함에 버려주세요."
  },
  {
    day: 10,
    title: "폐건전지 수거로 토양 오염 방지 🔋",
    desc: "다 쓴 건전지를 일반 쓰레기로 버리면 중금속이 토양과 지하수를 오염시킵니다. 하지만 분리 배출하면 철, 아연, 망간 등 귀중한 자원을 회수할 수 있습니다.",
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
