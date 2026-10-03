'use client';

import React, { useEffect, useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme } from '@/components/ThemeContext';
import { ChapterData, TOCItem } from '@/types';
import { 
  ChevronLeft, 
  ChevronRight, 
  List, 
  Bookmark as BookmarkIcon, 
  CheckCircle, 
  Search, 
  X, 
  ArrowUp,
  BookOpen
} from 'lucide-react';
import anime from '@/lib/animeHelper';

interface PageProps {
  params: Promise<{ chapterId: string }>;
}

export default function ChapterReaderPage({ params }: PageProps) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { 
    settings, 
    progress, 
    updateProgress, 
    toggleBookmark, 
    markCompleted, 
    isBookmarked, 
    isCompleted 
  } = useTheme();

  const chapterNum = parseInt(resolvedParams.chapterId, 10) || 1;
  const [chapter, setChapter] = useState<ChapterData | null>(null);
  const [toc, setToc] = useState<TOCItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isTocOpen, setIsTocOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrollPercent, setScrollPercent] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  // Load Chapter & TOC Data
  useEffect(() => {
    setIsLoading(true);

    fetch('/epub_data/toc.json')
      .then(res => res.json())
      .then(data => setToc(data))
      .catch(err => console.error('TOC load error:', err));

    fetch(`/epub_data/chapters/chapter-${chapterNum}.json`)
      .then(res => {
        if (!res.ok) throw new Error('Chapter not found');
        return res.json();
      })
      .then((data: ChapterData) => {
        setChapter(data);
        setIsLoading(false);
        updateProgress({ currentChapter: chapterNum });

        window.scrollTo({ top: 0, behavior: 'smooth' });

        if (contentRef.current) {
          anime({
            targets: contentRef.current,
            opacity: [0, 1],
            translateY: [15, 0],
            duration: 600,
            easing: 'easeOutCubic'
          });
        }
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, [chapterNum]);

  // Track scroll position percentage
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (totalHeight > 0) {
        const currentScroll = window.scrollY;
        const pct = Math.min(100, Math.max(0, Math.round((currentScroll / totalHeight) * 100)));
        setScrollPercent(pct);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Tap to Scroll feature
  const handleContentClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!settings.tapToScroll) return;
    // Don't trigger if user clicks an interactive element like button or link
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button') || target.closest('input')) return;

    const clickY = e.clientY;
    const windowHeight = window.innerHeight;

    // Tap in lower 75% of screen -> scroll down
    if (clickY > windowHeight * 0.25) {
      window.scrollBy({ top: windowHeight * 0.75, behavior: 'smooth' });
    } else {
      window.scrollBy({ top: -windowHeight * 0.75, behavior: 'smooth' });
    }
  };

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' && chapterNum > 1) {
        router.push(`/read/${chapterNum - 1}`);
      } else if (e.key === 'ArrowRight' && chapterNum < 869) {
        router.push(`/read/${chapterNum + 1}`);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [chapterNum, router]);

  const handleToggleBookmark = () => {
    if (!chapter) return;
    toggleBookmark({
      chapterNum: chapter.num,
      chapterTitle: chapter.title,
      timestamp: new Date().toISOString(),
      scrollPercent: scrollPercent
    });
  };

  const handleToggleCompleted = () => {
    if (isCompleted(chapterNum)) {
      const updated = progress.completedChapters.filter(c => c !== chapterNum);
      updateProgress({
        completedChapters: updated,
        totalChaptersRead: updated.length
      });
    } else {
      markCompleted(chapterNum);
    }
  };

  const filteredToc = toc.filter(item => 
    item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    `chapter ${item.num}`.includes(searchQuery.toLowerCase()) ||
    `${item.num}` === searchQuery.trim()
  );

  const getWidthClass = () => {
    switch (settings.readerWidth) {
      case 'narrow': return 'max-w-xl';
      case 'wide': return 'max-w-4xl';
      case 'full': return 'max-w-6xl';
      case 'medium':
      default: return 'max-w-2xl';
    }
  };

  const getFontClass = () => {
    switch (settings.fontFamily) {
      case 'sans': return 'font-sans';
      case 'mono': return 'font-mono';
      case 'cinzel': return 'font-cinzel';
      case 'serif':
      default: return 'font-serif';
    }
  };

  const getAlignClass = () => {
    switch (settings.textAlign) {
      case 'center': return 'text-center';
      case 'justify': return 'text-justify';
      case 'right': return 'text-right';
      case 'left':
      default: return 'text-left';
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-theme-base text-theme-primary transition-colors duration-300">
      
      {/* READING PROGRESS BAR - ALWAYS STAYS FIXED AT TOP */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-theme-surface z-50">
        <div 
          className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-150"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Reader Controls Header */}
      <header className="w-full border-b border-theme bg-theme-base/90 backdrop-blur-md z-40">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-2">
          
          {/* TOC Sidebar Toggle Button */}
          <button
            onClick={() => setIsTocOpen(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-theme bg-theme-surface hover:bg-theme-card text-xs font-semibold text-[var(--color-primary)] transition-all"
            title="Open Table of Contents"
          >
            <List className="w-4 h-4" />
            <span className="hidden sm:inline">Chapters</span>
          </button>

          {/* Quick Chapter Switcher Dropdown */}
          <div className="flex items-center gap-1.5">
            <Link
              href={`/read/${Math.max(1, chapterNum - 1)}`}
              className={`p-1.5 rounded-xl border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary transition-colors ${
                chapterNum <= 1 ? 'opacity-40 pointer-events-none' : ''
              }`}
              title="Previous Chapter (Left Arrow)"
            >
              <ChevronLeft className="w-4 h-4" />
            </Link>

            <select
              value={chapterNum}
              onChange={(e) => router.push(`/read/${e.target.value}`)}
              className="bg-theme-surface border border-theme text-theme-primary text-xs font-cinzel font-bold px-2 py-1.5 rounded-xl cursor-pointer focus:outline-none focus:border-[var(--color-primary)] text-center max-w-[140px] sm:max-w-[220px] truncate"
            >
              {toc.length > 0 ? (
                toc.map(item => (
                  <option key={item.num} value={item.num}>
                    Ch. {item.num}: {item.title}
                  </option>
                ))
              ) : (
                <option value={chapterNum}>Chapter {chapterNum}</option>
              )}
            </select>

            <Link
              href={`/read/${Math.min(869, chapterNum + 1)}`}
              className={`p-1.5 rounded-xl border border-theme bg-theme-surface text-theme-secondary hover:text-theme-primary transition-colors ${
                chapterNum >= 869 ? 'opacity-40 pointer-events-none' : ''
              }`}
              title="Next Chapter (Right Arrow)"
            >
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick Reader Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleBookmark}
              className={`p-2 rounded-xl border transition-all ${
                isBookmarked(chapterNum)
                  ? 'border-[var(--color-primary)] bg-theme-card text-[var(--color-primary)] shadow-sm'
                  : 'border-theme bg-theme-surface text-theme-muted hover:text-theme-primary'
              }`}
              title={isBookmarked(chapterNum) ? 'Remove Bookmark' : 'Bookmark Chapter'}
            >
              <BookmarkIcon className="w-4 h-4 fill-current" />
            </button>

            <button
              onClick={handleToggleCompleted}
              className={`p-2 rounded-xl border transition-all ${
                isCompleted(chapterNum)
                  ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                  : 'border-theme bg-theme-surface text-theme-muted hover:text-theme-primary'
              }`}
              title={isCompleted(chapterNum) ? 'Marked as Read (Click to Unmark)' : 'Mark as Completed'}
            >
              <CheckCircle className="w-4 h-4" />
            </button>
          </div>

        </div>
      </header>

      {/* Main Chapter Text Reader Container (Distinct Background Column on Laptop/Desktop matching beyonder.pages.dev) */}
      <main className="flex-1 py-6 md:py-12 px-2 sm:px-6">
        <div className={`mx-auto ${getWidthClass()}`}>
          
          {isLoading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-cinzel text-sm text-theme-secondary">Loading Chapter {chapterNum}...</p>
            </div>
          ) : chapter ? (
            /* DESKTOP / LAPTOP DISTINCT CONTAINER COLUMN STYLING */
            <article 
              ref={contentRef}
              onClick={handleContentClick}
              className={`space-y-8 bg-theme-surface md:p-10 lg:p-12 md:rounded-3xl transition-all select-text cursor-pointer ${
                (settings.showReaderBorder ?? true) ? 'md:border md:border-theme md:shadow-2xl' : 'md:border-transparent'
              }`}
            >
              
              {/* Chapter Header */}
              <div className="pb-8 border-b border-theme text-center space-y-2 select-none">
                <span className="text-xs uppercase font-bold font-mono tracking-widest text-[var(--color-secondary)] px-3 py-1 rounded-full bg-theme-base border border-theme inline-block">
                  Chapter {chapter.num} • {chapter.wordCount} Words
                </span>
                <h1 className="font-cinzel font-bold text-2xl sm:text-4xl text-theme-primary mt-2">
                  {chapter.title}
                </h1>
                {settings.tapToScroll && (
                  <p className="text-[11px] text-theme-muted font-mono">
                    💡 Tap lower screen to scroll down
                  </p>
                )}
              </div>

              {/* Formatted Chapter Body */}
              <div
                className={`reader-body ${getFontClass()} ${getAlignClass()} text-theme-primary leading-relaxed ${
                  settings.indentParagraphs ? 'indent-paragraphs' : ''
                }`}
                style={{
                  fontSize: `${settings.fontSize}px`,
                  lineHeight: settings.lineHeight,
                  fontWeight: settings.fontWeight || 400
                }}
                dangerouslySetInnerHTML={{ __html: chapter.content }}
              />

              {/* Chapter Footer Navigation */}
              <div className="pt-10 border-t border-theme flex flex-col sm:flex-row items-center justify-between gap-4 select-none">
                <Link
                  href={`/read/${Math.max(1, chapterNum - 1)}`}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl border border-theme bg-theme-base hover:bg-theme-card text-xs font-semibold text-theme-primary transition-all ${
                    chapterNum <= 1 ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                  Previous Chapter
                </Link>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs text-theme-muted hover:text-theme-primary transition-colors"
                >
                  <ArrowUp className="w-4 h-4" />
                  Back to Top
                </button>

                <Link
                  href={`/read/${Math.min(869, chapterNum + 1)}`}
                  className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold text-xs shadow-lg hover:scale-105 transition-all ${
                    chapterNum >= 869 ? 'opacity-40 pointer-events-none' : ''
                  }`}
                >
                  Next Chapter
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

            </article>
          ) : (
            <div className="py-20 text-center text-red-400">
              Failed to load chapter content.
            </div>
          )}

        </div>
      </main>

      {/* Slide-out Table of Contents Drawer */}
      {isTocOpen && (
        <div className="fixed inset-0 z-50 flex justify-start">
          <div 
            onClick={() => setIsTocOpen(false)} 
            className="fixed inset-0 bg-black/70 backdrop-blur-sm"
          />
          <div className="relative z-10 w-full max-w-sm h-full bg-theme-surface border-r border-theme shadow-2xl flex flex-col">
            
            <div className="p-4 border-b border-theme space-y-3 bg-theme-base">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-[var(--color-primary)]" />
                  <h2 className="font-cinzel font-bold text-base text-theme-primary">
                    Table of Contents ({toc.length})
                  </h2>
                </div>
                <button 
                  onClick={() => setIsTocOpen(false)}
                  className="p-1.5 rounded-lg text-theme-muted hover:text-theme-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input
                  type="text"
                  placeholder="Search title or chapter number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-theme-base border border-theme text-xs text-theme-primary focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-3 space-y-1">
              {filteredToc.map((item) => {
                const isActive = item.num === chapterNum;
                const completed = isCompleted(item.num);
                return (
                  <Link
                    key={item.num}
                    href={`/read/${item.num}`}
                    onClick={() => setIsTocOpen(false)}
                    className={`flex items-start justify-between p-2.5 rounded-xl border text-xs transition-all ${
                      isActive 
                        ? 'border-[var(--color-primary)] bg-theme-card text-[var(--color-primary)] font-bold shadow-sm'
                        : 'border-transparent text-theme-secondary hover:bg-theme-card/60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[var(--color-secondary)]">Ch. {item.num}</span>
                        {completed && (
                          <CheckCircle className="w-3 h-3 text-emerald-400 shrink-0" />
                        )}
                      </div>
                      <p className="text-theme-primary line-clamp-1 font-medium mt-0.5">
                        {item.title}
                      </p>
                    </div>
                    <span className="text-[10px] text-theme-muted shrink-0 ml-2">
                      {item.wordCount}w
                    </span>
                  </Link>
                );
              })}
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
