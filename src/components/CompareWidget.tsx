'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function CompareWidget() {
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const updateCount = () => {
      const list = JSON.parse(localStorage.getItem('compareList') || '[]');
      setCompareCount(list.length);
    };
    
    updateCount();
    window.addEventListener('storage', updateCount);
    // Custom event for same-tab updates
    window.addEventListener('compare-updated', updateCount);

    return () => {
      window.removeEventListener('storage', updateCount);
      window.removeEventListener('compare-updated', updateCount);
    };
  }, []);

  if (compareCount === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
      <Link href="/compare"
        className="bg-[#2d6a5e] hover:bg-[#245a50] text-white px-6 py-3 rounded-full shadow-2xl font-bold flex items-center gap-3 transition-colors border-2 border-white">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"/></svg>
        Compare properties ({compareCount}/3)
      </Link>
    </div>
  );
}
