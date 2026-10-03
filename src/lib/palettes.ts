import { PaletteId, PaletteInfo, ReadingSettings } from '@/types';

export const COLOR_PALETTES: PaletteInfo[] = [
  {
    id: 'catppuccin-mocha',
    name: 'Catppuccin Mocha',
    description: 'Soothing pastel dark theme with rich mauve & lavender accents.',
    badge: 'Popular',
    bgHex: '#1e1e2e',
    primaryHex: '#cba6f7',
    secondaryHex: '#89b4fa',
    textHex: '#cdd6f4',
    swatches: ['#1e1e2e', '#cba6f7', '#89b4fa', '#a6e3a1', '#f9e2af']
  },
  {
    id: 'cultivation-jade',
    name: 'Cultivation Dark (Emerald & Gold)',
    description: 'Deep Daoist jade aura with radiant golden Qi energy.',
    badge: 'Signature',
    bgHex: '#0b1317',
    primaryHex: '#00d294',
    secondaryHex: '#e6c875',
    textHex: '#e2f1ed',
    swatches: ['#0b1317', '#00d294', '#e6c875', '#38bdf8', '#10b981']
  },
  {
    id: 'ink-scroll',
    name: 'Ink Scroll (Sepia Parchment)',
    description: 'Ancient bamboo scroll parchment with rich cinnabar ink stamps.',
    badge: 'Paper',
    bgHex: '#f4ebd9',
    primaryHex: '#b83b5e',
    secondaryHex: '#c88942',
    textHex: '#2c221e',
    swatches: ['#f4ebd9', '#b83b5e', '#c88942', '#4a7c59', '#2c221e']
  },
  {
    id: 'celestial-ether',
    name: 'Celestial Ether (Midnight Cyan)',
    description: 'Mystic starry cosmos with shimmering electric amethyst.',
    badge: 'Cosmic',
    bgHex: '#0a0e1a',
    primaryHex: '#38bdf8',
    secondaryHex: '#a855f7',
    textHex: '#f1f5f9',
    swatches: ['#0a0e1a', '#38bdf8', '#a855f7', '#34d399', '#f472b6']
  },
  {
    id: 'obsidian-flame',
    name: 'Obsidian Flame (Crimson Regressor)',
    description: 'Volcanic demonic energy forged through thousands of rebirths.',
    badge: 'Fiery',
    bgHex: '#121214',
    primaryHex: '#ef4444',
    secondaryHex: '#f97316',
    textHex: '#f3f4f6',
    swatches: ['#121214', '#ef4444', '#f97316', '#eab308', '#dc2626']
  },
  {
    id: 'bamboo-zen',
    name: 'Bamboo Zen (Light Teal)',
    description: 'Clean day theme with calming mountain stream teal accents.',
    badge: 'Clean Day',
    bgHex: '#f0f7f4',
    primaryHex: '#0d9488',
    secondaryHex: '#0284c7',
    textHex: '#192724',
    swatches: ['#f0f7f4', '#0d9488', '#0284c7', '#854d0e', '#10b981']
  }
];

export const DEFAULT_SETTINGS: ReadingSettings = {
  palette: 'catppuccin-mocha' as PaletteId,
  fontSize: 18,
  lineHeight: 1.8,
  fontFamily: 'serif' as const,
  readerWidth: 'medium' as const,
  paragraphSpacing: 1.5,
  textAlign: 'left' as const,
  fontWeight: 400,
  indentParagraphs: false,
  stickyNavbar: false, // Default set to OFF per user request
  showReaderBorder: true,
  tapToScroll: true
};

export const DEFAULT_PROGRESS = {
  currentChapter: 1,
  currentScrollPercent: 0,
  completedChapters: [1],
  bookmarks: [],
  lastReadDate: new Date().toISOString(),
  totalChaptersRead: 1
};
