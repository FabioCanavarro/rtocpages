'use client';

import React from 'react';
import { useTheme } from './ThemeContext';
import { COLOR_PALETTES } from '@/lib/palettes';
import { PaletteId, FontFamily, ReaderWidth, TextAlign } from '@/types';
import { 
  X, 
  Check, 
  Cookie, 
  RefreshCw, 
  Download, 
  Upload, 
  Sliders, 
  Type, 
  Sparkles,
  AlignLeft,
  AlignCenter,
  AlignJustify,
  AlignRight,
  Maximize
} from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsDrawer({ isOpen, onClose }: Props) {
  const { 
    settings, 
    updateSettings, 
    progress, 
    setPalette, 
    resetAllCookies,
    activePalette 
  } = useTheme();

  if (!isOpen) return null;

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => console.error(err));
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(err => console.error(err));
      }
    }
  };

  const handleExportBackup = () => {
    const data = {
      settings,
      progress,
      exportedAt: new Date().toISOString(),
      novel: "A Regressor's Tale of Cultivation"
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `rtoc_reading_backup_${new Date().toISOString().slice(0,10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.settings) updateSettings(parsed.settings);
        alert('Reading settings and cookies restored successfully!');
      } catch (err) {
        alert('Invalid JSON backup file.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
      {/* Dark Overlay Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
      />

      {/* Slide-out Drawer Panel */}
      <div className="relative z-10 w-full max-w-md h-full bg-theme-surface border-l border-theme shadow-2xl flex flex-col transition-all duration-300">
        
        {/* Drawer Header */}
        <div className="p-5 border-b border-theme flex items-center justify-between bg-theme-base">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-[var(--color-primary)]" />
            <h2 className="font-cinzel font-bold text-lg text-theme-primary">Reading Settings</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl text-theme-secondary hover:text-theme-primary hover:bg-theme-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* SECTION 1: READABILITY */}
          <div className="space-y-5">
            <label className="text-xs uppercase font-bold tracking-widest font-cinzel text-[var(--color-secondary)] block">
              Readability
            </label>

            {/* Font Size & Line Height Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-theme-secondary font-medium">
                  <span>Size</span>
                  <span className="font-mono text-[var(--color-primary)] font-bold">{settings.fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="14"
                  max="32"
                  value={settings.fontSize}
                  onChange={(e) => updateSettings({ fontSize: Number(e.target.value) })}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs text-theme-secondary font-medium">
                  <span>Height</span>
                  <span className="font-mono text-[var(--color-primary)] font-bold">{settings.lineHeight}</span>
                </div>
                <input
                  type="range"
                  min="1.4"
                  max="2.2"
                  step="0.1"
                  value={settings.lineHeight}
                  onChange={(e) => updateSettings({ lineHeight: Number(e.target.value) })}
                  className="w-full accent-[var(--color-primary)] cursor-pointer"
                />
              </div>
            </div>

            {/* Font Weight Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs text-theme-secondary font-medium">
                <span>Weight</span>
                <span className="font-mono text-[var(--color-primary)] font-bold">{settings.fontWeight || 400}</span>
              </div>
              <input
                type="range"
                min="300"
                max="700"
                step="50"
                value={settings.fontWeight || 400}
                onChange={(e) => updateSettings({ fontWeight: Number(e.target.value) })}
                className="w-full accent-[var(--color-primary)] cursor-pointer"
              />
            </div>

            {/* Text Alignment Selector */}
            <div className="space-y-2">
              <span className="text-xs text-theme-secondary font-medium block">Alignment</span>
              <div className="grid grid-cols-4 gap-1.5 bg-theme-base p-1 rounded-xl border border-theme">
                {[
                  { id: 'left', icon: AlignLeft, label: 'Left' },
                  { id: 'center', icon: AlignCenter, label: 'Center' },
                  { id: 'justify', icon: AlignJustify, label: 'Justify' },
                  { id: 'right', icon: AlignRight, label: 'Right' },
                ].map(item => {
                  const Icon = item.icon;
                  const isActive = (settings.textAlign || 'left') === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => updateSettings({ textAlign: item.id as TextAlign })}
                      className={`py-2 flex items-center justify-center rounded-lg transition-all ${
                        isActive
                          ? 'bg-theme-card text-[var(--color-primary)] shadow-sm'
                          : 'text-theme-muted hover:text-theme-primary'
                      }`}
                      title={item.label}
                    >
                      <Icon className="w-4 h-4" />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Indent Paragraphs Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-theme-secondary font-medium">Indent Paragraphs</span>
              <button
                onClick={() => updateSettings({ indentParagraphs: !settings.indentParagraphs })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.indentParagraphs ? 'bg-[var(--color-primary)]' : 'bg-theme-base border border-theme'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.indentParagraphs ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Tap to Scroll Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-theme-secondary font-medium">Tap to Scroll</span>
              <button
                onClick={() => updateSettings({ tapToScroll: !settings.tapToScroll })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.tapToScroll ? 'bg-[var(--color-primary)]' : 'bg-theme-base border border-theme'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.tapToScroll ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Font Family Selector */}
            <div className="space-y-2 pt-2">
              <span className="text-xs text-theme-secondary font-medium block">Font Family</span>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { id: 'serif', label: 'Lora Serif', sample: 'Aa (Classic)' },
                  { id: 'sans', label: 'Inter Sans', sample: 'Aa (Modern)' },
                  { id: 'cinzel', label: 'Cinzel Dao', sample: 'Aa (Elegant)' },
                  { id: 'mono', label: 'JetBrains', sample: 'Aa (Code)' },
                ].map(font => (
                  <button
                    key={font.id}
                    onClick={() => updateSettings({ fontFamily: font.id as FontFamily })}
                    className={`p-2.5 rounded-lg border text-left text-xs transition-all ${
                      settings.fontFamily === font.id
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-theme-card font-semibold'
                        : 'border-theme text-theme-secondary hover:bg-theme-card/50'
                    }`}
                  >
                    <div className="font-medium">{font.label}</div>
                    <div className="text-[10px] text-theme-muted mt-0.5">{font.sample}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Reader Container Width */}
            <div className="space-y-2">
              <span className="text-xs text-theme-secondary font-medium block">Reader Width</span>
              <div className="grid grid-cols-4 gap-1.5">
                {[
                  { id: 'narrow', label: 'Narrow' },
                  { id: 'medium', label: 'Medium' },
                  { id: 'wide', label: 'Wide' },
                  { id: 'full', label: 'Full' },
                ].map(w => (
                  <button
                    key={w.id}
                    onClick={() => updateSettings({ readerWidth: w.id as ReaderWidth })}
                    className={`py-1.5 px-2 rounded-lg border text-center text-xs transition-all ${
                      settings.readerWidth === w.id
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-theme-card font-semibold'
                        : 'border-theme text-theme-muted hover:bg-theme-card/50'
                    }`}
                  >
                    {w.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* SECTION 2: INTERFACE */}
          <div className="space-y-4 pt-4 border-t border-theme">
            <label className="text-xs uppercase font-bold tracking-widest font-cinzel text-[var(--color-secondary)] block">
              Interface & Layout
            </label>

            {/* Toggle Fullscreen Button */}
            <button
              onClick={toggleFullscreen}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border border-theme bg-theme-card hover:bg-theme-card-hover text-xs font-semibold text-theme-primary transition-colors shadow-sm"
            >
              <Maximize className="w-4 h-4 text-[var(--color-primary)]" />
              Toggle Fullscreen
            </button>

            {/* Sticky Navbar Toggle */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-theme-secondary font-medium">Sticky Navbar</span>
              <button
                onClick={() => updateSettings({ stickyNavbar: !settings.stickyNavbar })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  settings.stickyNavbar ? 'bg-[var(--color-primary)]' : 'bg-theme-base border border-theme'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    settings.stickyNavbar ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            {/* Show Reader Container Border Switch (Added per user request) */}
            <div className="flex items-center justify-between py-2">
              <span className="text-xs text-theme-secondary font-medium">Reader Container Border</span>
              <button
                onClick={() => updateSettings({ showReaderBorder: !(settings.showReaderBorder ?? true) })}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  (settings.showReaderBorder ?? true) ? 'bg-[var(--color-primary)]' : 'bg-theme-base border border-theme'
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    (settings.showReaderBorder ?? true) ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* SECTION 3: COLOR PALETTES */}
          <div className="space-y-4 pt-4 border-t border-theme">
            <div className="flex items-center justify-between">
              <label className="text-xs uppercase font-bold tracking-widest font-cinzel text-[var(--color-secondary)] block">
                Color Palette
              </label>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-theme-card border border-theme text-[var(--color-primary)] font-medium">
                {activePalette.name}
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {COLOR_PALETTES.map((palette) => {
                const isActive = settings.palette === palette.id;
                return (
                  <button
                    key={palette.id}
                    onClick={() => setPalette(palette.id)}
                    className={`group relative w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between ${
                      isActive 
                        ? 'border-[var(--color-primary)] bg-theme-card shadow-lg ring-1 ring-[var(--color-primary)]' 
                        : 'border-theme hover:border-theme hover:bg-theme-card/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex items-center -space-x-1.5 overflow-hidden">
                        {palette.swatches.map((color, i) => (
                          <div 
                            key={i} 
                            className="w-4 h-4 rounded-full border border-black/20 shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                      <div>
                        <span className="font-medium text-xs text-theme-primary block">
                          {palette.name}
                        </span>
                      </div>
                    </div>

                    {isActive && (
                      <div className="w-5 h-5 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-theme-base shrink-0 shadow-sm">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* SECTION 4: COOKIE BACKUP */}
          <div className="space-y-4 pt-4 border-t border-theme">
            <div className="flex items-center gap-2">
              <Cookie className="w-4 h-4 text-[var(--color-secondary)]" />
              <label className="text-xs uppercase font-bold tracking-widest font-cinzel text-theme-primary">
                Cookie Data Sync
              </label>
            </div>

            <div className="p-3.5 rounded-xl bg-theme-base border border-theme text-xs space-y-2">
              <div className="flex items-center justify-between text-theme-secondary">
                <span>Completed Chapters:</span>
                <span className="font-bold text-theme-primary">{progress.completedChapters.length} / 869</span>
              </div>
              <div className="flex items-center justify-between text-theme-secondary">
                <span>Bookmarks Saved:</span>
                <span className="font-bold text-theme-primary">{progress.bookmarks.length}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleExportBackup}
                className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-theme bg-theme-card hover:bg-theme-card-hover text-xs font-medium text-theme-primary transition-colors"
              >
                <Download className="w-3.5 h-3.5 text-[var(--color-primary)]" />
                Export JSON
              </button>

              <label className="flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-xl border border-theme bg-theme-card hover:bg-theme-card-hover text-xs font-medium text-theme-primary transition-colors cursor-pointer">
                <Upload className="w-3.5 h-3.5 text-[var(--color-secondary)]" />
                Import JSON
                <input type="file" accept=".json" onChange={handleImportBackup} className="hidden" />
              </label>
            </div>

            <button
              onClick={() => {
                if (confirm('Reset all reading progress and settings to defaults?')) {
                  resetAllCookies();
                }
              }}
              className="w-full flex items-center justify-center gap-2 py-2 text-xs text-red-400 hover:text-red-300 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset All Saved Data
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
