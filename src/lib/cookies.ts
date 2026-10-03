import Cookies from 'js-cookie';
import { ReadingSettings, ReadingProgress, Bookmark } from '@/types';
import { DEFAULT_SETTINGS, DEFAULT_PROGRESS } from './palettes';

const SETTINGS_COOKIE_KEY = 'rtoc_settings_v1';
const PROGRESS_COOKIE_KEY = 'rtoc_progress_v1';
const COOKIE_EXPIRES_DAYS = 365;

export function getStoredSettings(): ReadingSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = Cookies.get(SETTINGS_COOKIE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (e) {
    console.error('Error loading settings from cookie:', e);
    return DEFAULT_SETTINGS;
  }
}

export function saveStoredSettings(settings: Partial<ReadingSettings>): ReadingSettings {
  const current = getStoredSettings();
  const updated = { ...current, ...settings };
  if (typeof window !== 'undefined') {
    try {
      Cookies.set(SETTINGS_COOKIE_KEY, JSON.stringify(updated), { expires: COOKIE_EXPIRES_DAYS, sameSite: 'lax' });
    } catch (e) {
      console.error('Error saving settings to cookie:', e);
    }
  }
  return updated;
}

export function getStoredProgress(): ReadingProgress {
  if (typeof window === 'undefined') return DEFAULT_PROGRESS;
  try {
    const raw = Cookies.get(PROGRESS_COOKIE_KEY);
    if (!raw) return DEFAULT_PROGRESS;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_PROGRESS, ...parsed };
  } catch (e) {
    console.error('Error loading progress from cookie:', e);
    return DEFAULT_PROGRESS;
  }
}

export function saveStoredProgress(progress: Partial<ReadingProgress>): ReadingProgress {
  const current = getStoredProgress();
  const updated = { ...current, ...progress, lastReadDate: new Date().toISOString() };
  if (typeof window !== 'undefined') {
    try {
      Cookies.set(PROGRESS_COOKIE_KEY, JSON.stringify(updated), { expires: COOKIE_EXPIRES_DAYS, sameSite: 'lax' });
    } catch (e) {
      console.error('Error saving progress to cookie:', e);
    }
  }
  return updated;
}

export function toggleBookmarkInCookie(bookmark: Bookmark): ReadingProgress {
  const current = getStoredProgress();
  const exists = current.bookmarks.some(b => b.chapterNum === bookmark.chapterNum);
  
  let newBookmarks: Bookmark[];
  if (exists) {
    newBookmarks = current.bookmarks.filter(b => b.chapterNum !== bookmark.chapterNum);
  } else {
    newBookmarks = [bookmark, ...current.bookmarks];
  }

  return saveStoredProgress({ bookmarks: newBookmarks });
}

export function markChapterCompletedInCookie(chapterNum: number): ReadingProgress {
  const current = getStoredProgress();
  if (current.completedChapters.includes(chapterNum)) return current;
  
  const updatedCompleted = [...current.completedChapters, chapterNum];
  return saveStoredProgress({
    completedChapters: updatedCompleted,
    totalChaptersRead: updatedCompleted.length
  });
}
