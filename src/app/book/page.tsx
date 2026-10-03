'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import CoverCard3D from '@/components/3DCoverCard';
import { useTheme } from '@/components/ThemeContext';
import { TOCItem, Bookmark } from '@/types';
import RangeModal from '@/components/RangeModal';
import { 
  BookOpen, 
  Download, 
  Search, 
  CheckCircle, 
  Bookmark as BookmarkIcon, 
  Play, 
  Filter, 
  Check, 
  RotateCcw,
  Sparkles,
  CheckSquare
} from 'lucide-react';

export default function BookDirectoryPage() {
  const { 
    progress, 
    toggleBookmark, 
    markCompleted, 
    markRangeCompleted,
    unmarkRangeCompleted,
    isBookmarked, 
    isCompleted,
    updateProgress 
  } = useTheme();

  const [toc, setToc] = useState<TOCItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'bookmarked' | 'completed' | 'unread'>('all');
  const [isLoading, setIsLoading] = useState(true);
  const [rangeStart, setRangeStart] = useState<number>(1);
  const [rangeEnd, setRangeEnd] = useState<number>(50);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch('/epub_data/toc.json')
      .then(res => res.json())
      .then((data: TOCItem[]) => {
        setToc(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error(err);
        setIsLoading(false);
      });
  }, []);

  const handleToggleCompleted = (e: React.MouseEvent, num: number) => {
    e.stopPropagation();
    e.preventDefault();
    if (isCompleted(num)) {
      // Unmark chapter completed
      const updated = progress.completedChapters.filter(c => c !== num);
      updateProgress({
        completedChapters: updated,
        totalChaptersRead: updated.length
      });
    } else {
      markCompleted(num);
    }
  };

  const handleToggleBookmark = (e: React.MouseEvent, item: TOCItem) => {
    e.stopPropagation();
    e.preventDefault();
    toggleBookmark({
      chapterNum: item.num,
      chapterTitle: item.title,
      timestamp: new Date().toISOString(),
      scrollPercent: 0
    });
  };

  const filteredChapters = toc.filter(item => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `chapter ${item.num}`.includes(searchQuery.toLowerCase()) ||
      `${item.num}` === searchQuery.trim();

    if (!matchesSearch) return false;

    if (activeTab === 'bookmarked') return isBookmarked(item.num);
    if (activeTab === 'completed') return isCompleted(item.num);
    if (activeTab === 'unread') return !isCompleted(item.num);

    return true;
  });

  const nextChapterToRead = progress.currentChapter || 1;

  return (
    <div className="min-h-screen flex flex-col bg-theme-base text-theme-primary transition-colors duration-300">
      
      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* LEFT COLUMN: Book Overview & Synopsis (Matching beyonder.pages.dev /book layout) */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-20">
            
            {/* 3D Novel Cover */}
            <div className="flex justify-center">
              <CoverCard3D coverUrl="/cover.png" title="A Regressor's Tale of Cultivation" />
            </div>

            {/* Title & Author Info */}
            <div className="text-center space-y-1">
              <h1 className="font-cinzel font-bold text-2xl sm:text-3xl text-theme-primary">
                A Regressor&apos;s Tale of Cultivation
              </h1>
              <p className="text-xs uppercase font-mono font-bold tracking-widest text-[var(--color-secondary)]">
                BY: PLUTO (해날) • 869 CHAPTERS
              </p>
            </div>

            {/* Main Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href={`/read/${nextChapterToRead}`}
                className="flex-1 flex items-center justify-center gap-2.5 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold text-sm shadow-xl hover:scale-[1.02] transition-all"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{progress.completedChapters.length > 0 ? `Continue Ch. ${nextChapterToRead}` : 'Start Reading'}</span>
              </Link>

              <a
                href="/A_Regressors_Tale_of_Cultivation.epub"
                download
                className="p-3.5 rounded-2xl bg-theme-surface border border-theme hover:border-[var(--color-primary)] text-theme-primary transition-colors flex items-center justify-center"
                title="Download EPUB (9.43 MB)"
              >
                <Download className="w-5 h-5 text-[var(--color-secondary)]" />
              </a>
            </div>

            {/* Novel Synopsis */}
            <div className="p-5 rounded-2xl bg-theme-surface border border-theme text-xs text-theme-secondary space-y-3 leading-relaxed">
              <p className="font-semibold text-theme-primary">
                Seo Eun-hyun finds himself transmigrated into a harsh Xianxia world trapped in an endless loop of regression upon death.
              </p>
              <p>
                With no legendary cheat abilities or innate spiritual roots, he must rely on sheer perseverance, martial mastery, and unyielding will across centuries of rebirth to defy destiny and carve his path back to immortality.
              </p>
            </div>

            {/* User Progress Stats Card */}
            <div className="p-4 rounded-2xl bg-theme-card border border-theme text-xs space-y-2.5">
              <div className="flex items-center justify-between text-theme-secondary">
                <span className="font-medium">Reading Progress</span>
                <span className="font-mono font-bold text-[var(--color-primary)]">
                  {Math.round((progress.completedChapters.length / 869) * 100)}% ({progress.completedChapters.length}/869)
                </span>
              </div>
              <div className="w-full h-2 rounded-full bg-theme-base overflow-hidden border border-theme">
                <div 
                  className="h-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] transition-all duration-300"
                  style={{ width: `${(progress.completedChapters.length / 869) * 100}%` }}
                />
              </div>
              <div className="flex items-center justify-between pt-1 text-theme-muted">
                <span>Bookmarks: <strong>{progress.bookmarks.length}</strong></span>
                <span>Cookie Saved</span>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Chapter Directory & Search (Matching beyonder.pages.dev /book list) */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Search & Filter Header Bar */}
            <div className="p-4 rounded-2xl bg-theme-surface border border-theme space-y-3">
              
              {/* Search Box */}
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
                <input
                  type="text"
                  placeholder="Search title or chapter number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-base border border-theme text-xs text-theme-primary focus:outline-none focus:border-[var(--color-primary)]"
                />
              </div>

              {/* Filter Tabs & Pop-up Trigger */}
              <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1 text-xs">
                <div className="flex items-center gap-1.5">
                  {[
                    { id: 'all', label: 'All Chapters', count: toc.length },
                    { id: 'bookmarked', label: 'Bookmarked', count: progress.bookmarks.length },
                    { id: 'completed', label: 'Completed', count: progress.completedChapters.length },
                    { id: 'unread', label: 'Unread', count: Math.max(0, toc.length - progress.completedChapters.length) },
                  ].map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-lg border font-semibold whitespace-nowrap transition-all ${
                        activeTab === tab.id
                          ? 'border-[var(--color-primary)] bg-theme-card text-[var(--color-primary)] shadow-sm'
                          : 'border-transparent text-theme-muted hover:text-theme-primary hover:bg-theme-card/50'
                      }`}
                    >
                      {tab.label} ({tab.count})
                    </button>
                  ))}
                </div>

                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold transition-all whitespace-nowrap flex items-center gap-1.5 text-xs shadow-sm shrink-0"
                  title="Open Bulk Mark Chapter Range Pop-up"
                >
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>Mark Range Pop-up</span>
                </button>
              </div>

              {/* Bulk Checkmark Range Selector Tool */}
              <div className="pt-2 border-t border-theme">
                <div className="p-3 rounded-xl bg-theme-base border border-theme flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="font-semibold text-theme-primary">Checkmark Range:</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex items-center gap-1">
                      <span className="text-theme-muted text-[11px]">From Ch</span>
                      <input
                        type="number"
                        min={1}
                        max={869}
                        value={rangeStart}
                        onChange={(e) => setRangeStart(Math.max(1, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-theme-surface border border-theme font-mono font-bold text-center text-[var(--color-primary)] focus:outline-none"
                      />
                    </div>

                    <div className="flex items-center gap-1">
                      <span className="text-theme-muted text-[11px]">to</span>
                      <input
                        type="number"
                        min={1}
                        max={869}
                        value={rangeEnd}
                        onChange={(e) => setRangeEnd(Math.min(869, parseInt(e.target.value) || 1))}
                        className="w-16 px-2 py-1 rounded bg-theme-surface border border-theme font-mono font-bold text-center text-[var(--color-primary)] focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={() => markRangeCompleted(rangeStart, rangeEnd)}
                      className="px-3 py-1 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold transition-all text-[11px] flex items-center gap-1"
                      title={`Mark chapters ${rangeStart} through ${rangeEnd} as completed`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      Mark Read
                    </button>

                    <button
                      onClick={() => unmarkRangeCompleted(rangeStart, rangeEnd)}
                      className="px-2.5 py-1 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold transition-all text-[11px]"
                      title={`Unmark chapters ${rangeStart} through ${rangeEnd}`}
                    >
                      Unmark
                    </button>
                  </div>
                </div>
              </div>

            </div>

            {/* Chapter List */}
            {isLoading ? (
              <div className="py-20 text-center space-y-3">
                <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="font-cinzel text-xs text-theme-secondary">Loading Chapter Directory...</p>
              </div>
            ) : filteredChapters.length > 0 ? (
              <div className="space-y-2">
                {filteredChapters.map((item) => {
                  const completed = isCompleted(item.num);
                  const bookmarked = isBookmarked(item.num);
                  return (
                    <div
                      key={item.num}
                      className={`group relative p-4 rounded-xl border transition-all flex items-center justify-between gap-4 ${
                        completed 
                          ? 'border-emerald-500/20 bg-theme-card/40 opacity-80' 
                          : 'border-theme bg-theme-card hover:border-[var(--color-primary)] hover:bg-theme-card-hover'
                      }`}
                    >
                      <Link
                        href={`/read/${item.num}`}
                        className="flex-1 min-w-0"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[var(--color-secondary)]">
                            CHAPTER {item.num}
                          </span>
                        </div>
                        <h3 className="font-cinzel font-bold text-sm sm:text-base text-theme-primary group-hover:text-[var(--color-primary)] transition-colors truncate mt-1">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Interactive Toggles: Bookmark & Completion */}
                      <div className="flex items-center gap-2 shrink-0">
                        {/* Bookmark Button */}
                        <button
                          onClick={(e) => handleToggleBookmark(e, item)}
                          className={`p-2 rounded-lg border transition-all ${
                            bookmarked
                              ? 'border-[var(--color-primary)] bg-[var(--color-primary)]/10 text-[var(--color-primary)]'
                              : 'border-theme bg-theme-surface text-theme-muted hover:text-theme-primary'
                          }`}
                          title={bookmarked ? 'Remove Bookmark' : 'Bookmark Chapter'}
                        >
                          <BookmarkIcon className={`w-4 h-4 ${bookmarked ? 'fill-current' : ''}`} />
                        </button>

                        {/* Complete / Unmark Toggle Button */}
                        <button
                          onClick={(e) => handleToggleCompleted(e, item.num)}
                          className={`p-2 rounded-lg border transition-all ${
                            completed
                              ? 'border-emerald-500/50 bg-emerald-500/10 text-emerald-400'
                              : 'border-theme bg-theme-surface text-theme-muted hover:text-theme-primary'
                          }`}
                          title={completed ? 'Unmark Chapter as Completed' : 'Mark Chapter as Completed'}
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="py-16 text-center text-xs text-theme-muted border border-theme rounded-2xl bg-theme-surface space-y-2">
                <p className="font-cinzel font-bold text-sm text-theme-primary">No Chapters Found</p>
                <p>Try clearing your search query or switching filter tabs.</p>
              </div>
            )}

          </div>

        </div>

      </main>

      {/* Bulk Chapter Range Modal Pop-up */}
      <RangeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

    </div>
  );
}
