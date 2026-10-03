'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ReaderIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/book');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-theme-base text-theme-primary">
      <div className="text-center space-y-3">
        <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="font-cinzel text-sm text-theme-secondary">Loading Book Directory...</p>
      </div>
    </div>
  );
}
