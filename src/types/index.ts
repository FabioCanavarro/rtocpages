export type PaletteId = 
  | 'catppuccin-mocha' 
  | 'cultivation-jade' 
  | 'ink-scroll' 
  | 'celestial-ether' 
  | 'obsidian-flame' 
  | 'bamboo-zen';

export type FontFamily = 'serif' | 'sans' | 'mono' | 'cinzel';

export type ReaderWidth = 'narrow' | 'medium' | 'wide' | 'full';

export type TextAlign = 'left' | 'center' | 'justify' | 'right';

export interface PaletteInfo {
  id: PaletteId;
  name: string;
  description: string;
  badge: string;
  bgHex: string;
  primaryHex: string;
  secondaryHex: string;
  textHex: string;
  swatches: string[];
}

export interface ReadingSettings {
  palette: PaletteId;
  fontSize: number; // 14 - 32
  lineHeight: number; // 1.4 - 2.2
  fontFamily: FontFamily;
  readerWidth: ReaderWidth;
  paragraphSpacing: number; // 1 - 3
  textAlign: TextAlign;
  fontWeight: number; // 300 - 700
  indentParagraphs: boolean;
  stickyNavbar: boolean;
  showReaderBorder: boolean;
  tapToScroll: boolean;
}

export interface Bookmark {
  chapterNum: number;
  chapterTitle: string;
  timestamp: string;
  snippet?: string;
  scrollPercent: number;
}

export interface ReadingProgress {
  currentChapter: number;
  currentScrollPercent: number;
  completedChapters: number[];
  bookmarks: Bookmark[];
  lastReadDate: string;
  totalChaptersRead: number;
}

export interface TOCItem {
  id: string;
  num: number;
  title: string;
  wordCount: number;
  preview: string;
}

export interface NovelMetadata {
  title: string;
  originalTitle: string;
  author: string;
  translator: string;
  totalChapters: number;
  totalWords: number;
  fileSizeMB: number;
  description: string;
  cover: string;
}

export interface ChapterData {
  id: string;
  num: number;
  title: string;
  wordCount: number;
  content: string;
}
