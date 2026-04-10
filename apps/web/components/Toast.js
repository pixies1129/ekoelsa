'use client';

import React, { useEffect, useState } from 'react';

export default function Toast({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (message) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        if (onClose) {
          // Wait for fade out animation
          setTimeout(onClose, 300);
        }
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [message, duration, onClose]);

  if (!message && !visible) return null;

  return (
    <div
      className={`fixed bottom-28 left-1/2 -translate-x-1/2 bg-gray-800 text-white px-6 py-3.5 rounded-full shadow-2xl z-[100] text-sm font-bold text-center whitespace-pre-wrap transition-all duration-300 w-11/12 max-w-[320px] ${
        visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
      }`}
    >
      {message}
    </div>
  );
}
