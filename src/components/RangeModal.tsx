'use client';

import React, { useState } from 'react';
import { useTheme } from './ThemeContext';
import { X, CheckCircle, Check, RotateCcw, Sparkles, CheckSquare } from 'lucide-react';

interface RangeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function RangeModal({ isOpen, onClose }: RangeModalProps) {
  const { markRangeCompleted, unmarkRangeCompleted } = useTheme();
  const [startCh, setStartCh] = useState<number>(1);
  const [endCh, setEndCh] = useState<number>(50);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleMarkRead = () => {
    const min = Math.max(1, Math.min(startCh, endCh));
    const max = Math.min(869, Math.max(startCh, endCh));
    markRangeCompleted(min, max);
    setToastMessage(`Marked Chapters ${min} to ${max} as Completed!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleUnmarkRead = () => {
    const min = Math.max(1, Math.min(startCh, endCh));
    const max = Math.min(869, Math.max(startCh, endCh));
    unmarkRangeCompleted(min, max);
    setToastMessage(`Unmarked Chapters ${min} to ${max}!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const applyPreset = (min: number, max: number) => {
    setStartCh(min);
    setEndCh(max);
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Semi-transparent Backdrop */}
      <div 
        onClick={onClose}
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Dialog Box */}
      <div className="relative z-10 w-full max-w-md bg-theme-surface border border-theme rounded-3xl shadow-2xl overflow-hidden p-6 space-y-6 animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-theme">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <CheckSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-cinzel font-bold text-lg text-theme-primary">Bulk Chapter Progress</h3>
              <p className="text-xs text-theme-secondary">Quickly migrate your reading progress</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-xl text-theme-muted hover:text-theme-primary hover:bg-theme-card transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Presets */}
        <div className="space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wider text-theme-secondary block">
            Quick Presets
          </label>
          <div className="grid grid-cols-5 gap-1.5">
            {[
              { label: '1 - 50', start: 1, end: 50 },
              { label: '1 - 100', start: 1, end: 100 },
              { label: '1 - 250', start: 1, end: 250 },
              { label: '1 - 500', start: 1, end: 500 },
              { label: 'All 869', start: 1, end: 869 },
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => applyPreset(p.start, p.end)}
                className={`py-1.5 px-1 rounded-lg border text-center text-[11px] font-mono transition-all ${
                  startCh === p.start && endCh === p.end
                    ? 'border-[var(--color-primary)] text-[var(--color-primary)] bg-theme-card font-bold'
                    : 'border-theme text-theme-muted hover:bg-theme-card/50 hover:text-theme-primary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Range Input Fields */}
        <div className="p-4 rounded-2xl bg-theme-base border border-theme space-y-3">
          <label className="text-xs font-semibold text-theme-secondary block">
            Select Custom Range
          </label>
          
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <span className="text-[11px] text-theme-muted">From Chapter</span>
              <input
                type="number"
                min={1}
                max={869}
                value={startCh}
                onChange={(e) => setStartCh(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme text-sm font-mono font-bold text-center text-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            <div className="space-y-1">
              <span className="text-[11px] text-theme-muted">To Chapter</span>
              <input
                type="number"
                min={1}
                max={869}
                value={endCh}
                onChange={(e) => setEndCh(Math.min(869, parseInt(e.target.value) || 1))}
                className="w-full px-3 py-2 rounded-xl bg-theme-surface border border-theme text-sm font-mono font-bold text-center text-[var(--color-primary)] focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Toast feedback message */}
        {toastMessage && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs text-center font-semibold animate-in fade-in">
            {toastMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleMarkRead}
            className="flex-1 py-3 px-4 rounded-2xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 border border-emerald-500/40 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-lg"
          >
            <Check className="w-4 h-4" />
            Mark Range Read
          </button>

          <button
            onClick={handleUnmarkRead}
            className="py-3 px-4 rounded-2xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Unmark Range
          </button>
        </div>

      </div>
    </div>
  );
}
