'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import CoverCard3D from '@/components/3DCoverCard';
import { useTheme } from '@/components/ThemeContext';
import { BookOpen, Download, Sparkles, Feather, Shield, Compass, ChevronRight, AlertCircle } from 'lucide-react';
import anime from '@/lib/animeHelper';

export default function HomePage() {
  const { progress, activePalette } = useTheme();

  useEffect(() => {
    anime({
      targets: '.hero-animate',
      translateY: [20, 0],
      opacity: [0, 1],
      delay: anime.stagger(100),
      duration: 1000,
      easing: 'easeOutCubic'
    });
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between bg-theme-base text-theme-primary transition-colors duration-300">
      
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-8 pb-12 md:pt-14 md:pb-16 px-4 sm:px-6 lg:px-8 my-auto">
        {/* Background Ambient Particles Overlay */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-radial from-[var(--color-primary)]/10 via-transparent to-transparent pointer-events-none -z-10 blur-3xl" />

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-around gap-10 lg:gap-16">
          
          {/* 3D Novel Cover Card */}
          <div className="w-full md:w-auto flex justify-center shrink-0">
            <CoverCard3D coverUrl="/cover.png" title="A Regressor's Tale of Cultivation" />
          </div>

          {/* Hero Content Text */}
          <div className="flex flex-col items-center md:items-start text-center md:text-left max-w-2xl">
            
            {/* Active Theme Badge */}
            <div className="hero-animate inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-theme-surface border border-theme mb-3 shadow-sm">
              <Sparkles className="w-4 h-4 text-[var(--color-primary)]" />
              <span className="text-xs font-semibold text-theme-secondary">
                Theme: <strong className="text-[var(--color-primary)] font-cinzel">{activePalette.name}</strong>
              </span>
            </div>

            {/* Main Title */}
            <h1 className="hero-animate font-cinzel font-black text-3xl sm:text-5xl lg:text-6xl tracking-tight text-theme-primary filter drop-shadow-md leading-tight">
              A Regressor&apos;s Tale of Cultivation
            </h1>
            
            <p className="hero-animate text-xs sm:text-sm font-semibold font-mono text-[var(--color-secondary)] uppercase tracking-widest mt-2">
              회차진행자: 회귀자의 신선기 • Author: Pluto (해날)
            </p>

            {/* Iconic Novel Quote */}
            <blockquote className="hero-animate py-4 px-4 my-3 rounded-2xl bg-theme-surface/60 border-l-4 border-[var(--color-primary)] text-sm sm:text-base text-theme-secondary italic leading-relaxed backdrop-blur-sm">
              &ldquo;The Fool may wander through gray fog, but I walk through blood and broken swords across ten thousand lifetimes. Even without innate talent or legendary cheats... I shall carve my own Dao into the celestial sky.&rdquo;
            </blockquote>

            {/* Primary Action CTA Buttons */}
            <div className="hero-animate flex flex-wrap items-center justify-center md:justify-start gap-3 mt-1">
              <Link
                href="/book"
                className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold text-sm sm:text-base shadow-xl hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <BookOpen className="w-5 h-5" />
                <span>
                  {progress.completedChapters.length > 0 ? `Continue (Ch. ${progress.currentChapter || 1})` : 'Browse Chapters'}
                </span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="/A_Regressors_Tale_of_Cultivation.epub"
                download
                className="inline-flex items-center gap-2.5 px-5 py-3 rounded-2xl bg-theme-surface border border-theme hover:border-[var(--color-primary)] text-theme-primary hover:text-[var(--color-primary)] font-semibold text-sm sm:text-base shadow-md hover:scale-105 active:scale-95 transition-all duration-200"
              >
                <Download className="w-5 h-5 text-[var(--color-secondary)]" />
                <span>Download EPUB</span>
              </a>

              {/* GitHub Repo Link */}
              <a
                href="https://github.com/FabioCanavarro/rtocpages"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-theme-surface border border-theme hover:border-theme-accent text-theme-secondary hover:text-theme-primary text-xs font-semibold shadow-sm hover:scale-105 transition-all"
              >
                <svg className="w-4 h-4 fill-current text-sky-400" viewBox="0 0 24 24">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
                </svg>
                <span>GitHub Repo</span>
              </a>

              {/* Report Issues Link */}
              <a
                href="https://github.com/FabioCanavarro/rtocpages/issues"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-theme-surface border border-theme hover:border-theme-accent text-theme-secondary hover:text-theme-primary text-xs font-semibold shadow-sm hover:scale-105 transition-all"
              >
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Report Issue</span>
              </a>
            </div>

            {/* Quick Specs Bar */}
            <div className="hero-animate flex items-center gap-6 mt-6 pt-5 border-t border-theme text-xs text-theme-muted">
              <div className="flex items-center gap-1.5">
                <Feather className="w-4 h-4 text-[var(--color-primary)]" />
                <span><strong>869</strong> Chapters</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-[var(--color-secondary)]" />
                <span><strong>1.2M+</strong> Words</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-400" />
                <span>Cookies Sync</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FOOTER (CLEAN & COMPACT, NO UNWANTED SUBTEXT) */}
      <footer className="border-t border-theme bg-theme-surface py-5 px-4 text-center text-xs text-theme-muted shrink-0">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            <p className="font-cinzel font-bold text-theme-primary text-sm">
              A Regressor&apos;s Tale of Cultivation Web Reader
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-theme-secondary">
            <Link href="/book" className="hover:text-theme-primary transition-colors">Book Directory</Link>
            <a href="/A_Regressors_Tale_of_Cultivation.epub" download className="hover:text-theme-primary transition-colors">Download EPUB</a>
            <a href="https://github.com/FabioCanavarro/rtocpages" target="_blank" rel="noopener noreferrer" className="hover:text-theme-primary transition-colors">GitHub Repo</a>
            <a href="https://github.com/FabioCanavarro/rtocpages/issues" target="_blank" rel="noopener noreferrer" className="hover:text-theme-primary transition-colors">Report Issue</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
