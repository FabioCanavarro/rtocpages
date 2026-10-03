'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from './ThemeContext';
import SettingsDrawer from './SettingsDrawer';
import { 
  BookOpen, 
  Download, 
  Settings, 
  Palette,
  Flame
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { progress, activePalette, isLoaded } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  return (
    <>
      {/* Main Top Navigation Header */}
      <header className="sticky top-0 z-40 w-full border-b border-theme bg-theme-base/90 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Clean Logo & Title (No icon next to RTOC as requested) */}
          <Link href="/" className="flex items-center gap-2 group">
            <div>
              <span className="font-cinzel font-bold text-lg sm:text-xl tracking-wide text-theme-primary block group-hover:text-[var(--color-primary)] transition-colors">
                Regressor&apos;s Tale
              </span>
              <span className="text-[10px] uppercase font-semibold text-[var(--color-secondary)] tracking-widest block -mt-1">
                Cultivation Reader
              </span>
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1 bg-theme-surface/60 p-1 rounded-2xl border border-theme">
            {[
              { href: '/', label: 'Home' },
              { href: '/book', label: 'Book Directory' },
            ].map((item) => {
              const isActive = pathname === item.href || (item.href === '/book' && (pathname.startsWith('/book') || pathname.startsWith('/read')));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive 
                      ? 'bg-theme-card text-[var(--color-primary)] shadow-sm border border-theme' 
                      : 'text-theme-secondary hover:text-theme-primary hover:bg-theme-card/50'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          {/* Quick Actions Right Side */}
          <div className="flex items-center gap-2.5">
            {/* Active Reading Progress Indicator */}
            {isLoaded && (
              <Link 
                href={`/read/${progress.currentChapter || 1}`}
                className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-theme bg-theme-surface text-xs font-medium text-theme-secondary hover:border-theme hover:text-theme-primary transition-all"
                title="Continue reading from saved chapter cookie"
              >
                <Flame className="w-3.5 h-3.5 text-[var(--color-secondary)] animate-pulse" />
                <span>Ch. {progress.currentChapter || 1}</span>
              </Link>
            )}

            {/* Palette Switcher Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl border border-theme bg-theme-card hover:bg-theme-card-hover text-xs font-semibold text-[var(--color-primary)] transition-all shadow-sm"
              title={`Active Palette: ${activePalette.name}`}
            >
              <Palette className="w-4 h-4" />
              <span className="hidden sm:inline font-cinzel">{activePalette.name}</span>
            </button>

            {/* Settings Gear Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl border border-theme bg-theme-surface hover:bg-theme-card text-theme-secondary hover:text-theme-primary transition-all shadow-sm"
              title="Open Settings Drawer"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Floating Side Action Toolbar */}
      <div className="fixed right-3 top-1/3 z-30 flex flex-col gap-2.5">
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="group relative p-3 rounded-2xl bg-theme-surface/90 border border-theme shadow-xl backdrop-blur-md text-[var(--color-primary)] hover:scale-110 transition-all hover:bg-theme-card"
        >
          <Settings className="w-5 h-5" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-theme-card border border-theme text-xs font-semibold text-theme-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            Palette & Settings
          </span>
        </button>

        <Link
          href="/book"
          className="group relative p-3 rounded-2xl bg-theme-surface/90 border border-theme shadow-xl backdrop-blur-md text-[var(--color-secondary)] hover:scale-110 transition-all hover:bg-theme-card"
        >
          <BookOpen className="w-5 h-5" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-theme-card border border-theme text-xs font-semibold text-theme-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            Book Directory
          </span>
        </Link>

        <a
          href="/A_Regressors_Tale_of_Cultivation.epub"
          download
          className="group relative p-3 rounded-2xl bg-theme-surface/90 border border-theme shadow-xl backdrop-blur-md text-emerald-400 hover:scale-110 transition-all hover:bg-theme-card"
        >
          <Download className="w-5 h-5" />
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-theme-card border border-theme text-xs font-semibold text-theme-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
            Download EPUB (9.4MB)
          </span>
        </a>
      </div>

      {/* Settings Modal/Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
