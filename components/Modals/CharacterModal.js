'use client';

export default function CharacterModal({ isOpen, onClose, onSelect }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-4">
      <div className="bg-white w-full max-w-sm rounded-2xl p-6 shadow-2xl animate-in">
        <h2 className="text-lg font-bold text-center text-gray-800 mb-1">키울 캐릭터 선택</h2>
        <p className="text-xs text-center text-gray-500 mb-4">지구온난화로 위기에 처한 생태계</p>
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            onClick={() => onSelect('type1')} 
            className="bg-green-50 border border-green-200 p-4 rounded-xl flex flex-col items-center hover:bg-green-100 transition-colors"
          >
            <span className="text-3xl mb-1">🌳</span><span className="text-xs font-bold text-green-800">나무</span>
          </button>
          <button 
            onClick={() => onSelect('type2')} 
            className="bg-blue-50 border border-blue-200 p-4 rounded-xl flex flex-col items-center hover:bg-blue-100 transition-colors"
          >
            <span className="text-3xl mb-1">🐻‍❄️</span><span className="text-xs font-bold text-blue-800">북극곰</span>
          </button>
          <button 
            onClick={() => onSelect('type3')} 
            className="bg-indigo-50 border border-indigo-200 p-4 rounded-xl flex flex-col items-center hover:bg-indigo-100 transition-colors"
          >
            <span className="text-3xl mb-1">🐧</span><span className="text-xs font-bold text-indigo-800">펭귄</span>
          </button>
        </div>
        <button 
          onClick={onClose} 
          className="w-full bg-gray-200 text-gray-700 font-bold py-2 rounded-xl hover:bg-gray-300 transition-colors"
        >
          닫기
        </button>
      </div>
    </div>
  );
}
