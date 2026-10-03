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
  Flame,
  AlertCircle
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { settings, progress, activePalette, isLoaded } = useTheme();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const isHomePage = pathname === '/';
  const isSticky = settings.stickyNavbar ?? false;

  return (
    <>
      {/* Main Top Navigation Header */}
      <header className={`${isSticky ? 'sticky top-0' : 'relative'} z-40 w-full border-b border-theme bg-theme-base/90 backdrop-blur-md transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          {/* Clean Logo & Title */}
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
          <div className="flex items-center gap-2 sm:gap-2.5">
            
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

            {/* COMBINED ACTION BUTTONS WHEN NOT ON HOMEPAGE */}
            {!isHomePage && (
              <>
                <Link
                  href="/book"
                  className="p-2 rounded-xl border border-theme bg-theme-surface hover:bg-theme-card text-[var(--color-secondary)] transition-all shadow-sm"
                  title="Book Directory Dashboard"
                >
                  <BookOpen className="w-4 h-4" />
                </Link>

                <a
                  href="/A_Regressors_Tale_of_Cultivation.epub"
                  download
                  className="p-2 rounded-xl border border-theme bg-theme-surface hover:bg-theme-card text-emerald-400 transition-all shadow-sm"
                  title="Download EPUB (9.43 MB)"
                >
                  <Download className="w-4 h-4" />
                </a>
              </>
            )}

            {/* Palette Switcher Button */}
            <button
              onClick={() => setIsSettingsOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-theme bg-theme-card hover:bg-theme-card-hover text-xs font-semibold text-[var(--color-primary)] transition-all shadow-sm"
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

      {/* Floating Side Action Toolbar (ONLY SHOWN ON HOMEPAGE '/') */}
      {isHomePage && (
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

          {/* GitHub Repository Link */}
          <a
            href="https://github.com/FabioCanavarro/rtocpages"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 rounded-2xl bg-theme-surface/90 border border-theme shadow-xl backdrop-blur-md text-sky-400 hover:scale-110 transition-all hover:bg-theme-card"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
            </svg>
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-theme-card border border-theme text-xs font-semibold text-theme-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
              GitHub Repository
            </span>
          </a>

          {/* Report Issues Link */}
          <a
            href="https://github.com/FabioCanavarro/rtocpages/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative p-3 rounded-2xl bg-theme-surface/90 border border-theme shadow-xl backdrop-blur-md text-amber-400 hover:scale-110 transition-all hover:bg-theme-card"
          >
            <AlertCircle className="w-5 h-5" />
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-2.5 py-1 rounded-lg bg-theme-card border border-theme text-xs font-semibold text-theme-primary opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap shadow-lg">
              Report Issues
            </span>
          </a>
        </div>
      )}

      {/* Settings Modal/Drawer */}
      <SettingsDrawer
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
