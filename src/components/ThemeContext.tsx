'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ReadingSettings, ReadingProgress, Bookmark, PaletteId } from '@/types';
import { DEFAULT_SETTINGS, DEFAULT_PROGRESS, COLOR_PALETTES } from '@/lib/palettes';
import { 
  getStoredSettings, 
  saveStoredSettings, 
  getStoredProgress, 
  saveStoredProgress,
  toggleBookmarkInCookie,
  markChapterCompletedInCookie
} from '@/lib/cookies';

interface ThemeContextType {
  settings: ReadingSettings;
  progress: ReadingProgress;
  activePalette: typeof COLOR_PALETTES[0];
  updateSettings: (newSettings: Partial<ReadingSettings>) => void;
  updateProgress: (newProgress: Partial<ReadingProgress>) => void;
  toggleBookmark: (bookmark: Bookmark) => void;
  markCompleted: (chapterNum: number) => void;
  isBookmarked: (chapterNum: number) => boolean;
  isCompleted: (chapterNum: number) => boolean;
  setPalette: (id: PaletteId) => void;
  resetAllCookies: () => void;
  isLoaded: boolean;
}

const ThemeContext = createContext<ThemeContextType | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ReadingSettings>(DEFAULT_SETTINGS);
  const [progress, setProgress] = useState<ReadingProgress>(DEFAULT_PROGRESS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Load stored preferences from cookie on client mount
    const initialSettings = getStoredSettings();
    const initialProgress = getStoredProgress();
    setSettings(initialSettings);
    setProgress(initialProgress);
    setIsLoaded(true);

    // Apply palette attribute to <html> element
    document.documentElement.setAttribute('data-palette', initialSettings.palette);
  }, []);

  const updateSettings = (newSettings: Partial<ReadingSettings>) => {
    const updated = saveStoredSettings(newSettings);
    setSettings(updated);
    if (newSettings.palette) {
      document.documentElement.setAttribute('data-palette', newSettings.palette);
    }
  };

  const updateProgress = (newProgress: Partial<ReadingProgress>) => {
    const updated = saveStoredProgress(newProgress);
    setProgress(updated);
  };

  const setPalette = (id: PaletteId) => {
    updateSettings({ palette: id });
  };

  const toggleBookmark = (bookmark: Bookmark) => {
    const updated = toggleBookmarkInCookie(bookmark);
    setProgress(updated);
  };

  const markCompleted = (chapterNum: number) => {
    const updated = markChapterCompletedInCookie(chapterNum);
    setProgress(updated);
  };

  const isBookmarked = (chapterNum: number) => {
    return progress.bookmarks.some(b => b.chapterNum === chapterNum);
  };

  const isCompleted = (chapterNum: number) => {
    return progress.completedChapters.includes(chapterNum);
  };

  const resetAllCookies = () => {
    updateSettings(DEFAULT_SETTINGS);
    updateProgress(DEFAULT_PROGRESS);
  };

  const activePalette = COLOR_PALETTES.find(p => p.id === settings.palette) || COLOR_PALETTES[0];

  return (
    <ThemeContext.Provider
      value={{
        settings,
        progress,
        activePalette,
        updateSettings,
        updateProgress,
        toggleBookmark,
        markCompleted,
        isBookmarked,
        isCompleted,
        setPalette,
        resetAllCookies,
        isLoaded
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
