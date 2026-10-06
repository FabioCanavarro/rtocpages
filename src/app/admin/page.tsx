'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import MarkdownRenderer from '@/components/MarkdownRenderer';
import { 
  ShieldCheck, 
  Lock, 
  Trash2, 
  CheckSquare, 
  Square, 
  Search, 
  RefreshCw, 
  AlertTriangle, 
  LogOut,
  Eye,
  MessageSquare,
  BookOpen,
  Filter,
  CheckCircle2,
  ExternalLink
} from 'lucide-react';

interface Comment {
  id: string;
  chapterId: number;
  author: string;
  content: string;
  createdAt: string;
  likes?: number;
}

interface AdminStats {
  totalComments: number;
  totalViews: number;
  viewsMap: Record<number, number>;
}

export default function AdminPage() {
  const [passwordInput, setPasswordInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authError, setAuthError] = useState('');
  const [adminToken, setAdminToken] = useState<string>('');

  const [comments, setComments] = useState<Comment[]>([]);
  const [stats, setStats] = useState<AdminStats>({ totalComments: 0, totalViews: 0, viewsMap: {} });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedChapterFilter, setSelectedChapterFilter] = useState<string>('all');

  // Checkbox selection for mass delete
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [actionFeedback, setActionFeedback] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  // Check saved session on mount
  useEffect(() => {
    const savedToken = sessionStorage.getItem('rtoc_admin_pwd');
    if (savedToken === 'Rtoc') {
      setIsAuthenticated(true);
      setAdminToken('Rtoc');
      fetchAdminData('Rtoc');
    }
  }, []);

  // Login handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (passwordInput === 'Rtoc') {
      setIsAuthenticated(true);
      setAdminToken('Rtoc');
      sessionStorage.setItem('rtoc_admin_pwd', 'Rtoc');
      fetchAdminData('Rtoc');
    } else {
      setAuthError('Incorrect Password. Access Denied.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAdminToken('');
    sessionStorage.removeItem('rtoc_admin_pwd');
    setPasswordInput('');
  };

  // Fetch admin comments & metrics
  const fetchAdminData = async (pwd: string = adminToken) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/comments`, {
        headers: { 'x-admin-password': pwd }
      });

      if (res.status === 401) {
        setIsAuthenticated(false);
        sessionStorage.removeItem('rtoc_admin_pwd');
        setAuthError('Session expired or unauthorized.');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setComments(data.comments || []);
        setStats(data.stats || { totalComments: 0, totalViews: 0, viewsMap: {} });
      }
    } catch (err) {
      console.error('Failed to load admin data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Single Comment Delete
  const handleDeleteSingle = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      setIsDeleting(true);
      const res = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminToken
        },
        body: JSON.stringify({ commentId, password: adminToken })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback('Comment deleted successfully!');
        setSelectedIds(prev => {
          const next = new Set(prev);
          next.delete(commentId);
          return next;
        });
        fetchAdminData();
        setTimeout(() => setActionFeedback(''), 3000);
      } else {
        alert(data.error || 'Failed to delete comment');
      }
    } catch (err) {
      console.error(err);
      alert('Error deleting comment');
    } finally {
      setIsDeleting(false);
    }
  };

  // Mass / Bulk Delete
  const handleDeleteBulk = async () => {
    const idsArray = Array.from(selectedIds);
    if (idsArray.length === 0) return;

    if (!confirm(`Are you sure you want to MASS DELETE ${idsArray.length} selected comment(s)? This action cannot be undone.`)) {
      return;
    }

    try {
      setIsDeleting(true);
      const res = await fetch('/api/admin/comments', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-password': adminToken
        },
        body: JSON.stringify({ commentIds: idsArray, password: adminToken })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setActionFeedback(`Mass deleted ${data.count} comment(s)!`);
        setSelectedIds(new Set());
        fetchAdminData();
        setTimeout(() => setActionFeedback(''), 3000);
      } else {
        alert(data.error || 'Failed to mass delete comments');
      }
    } catch (err) {
      console.error(err);
      alert('Error performing mass delete');
    } finally {
      setIsDeleting(false);
    }
  };

  // Selection Toggles
  const toggleSelectComment = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const toggleSelectAllFiltered = () => {
    if (selectedIds.size === filteredComments.length && filteredComments.length > 0) {
      setSelectedIds(new Set());
    } else {
      const newSet = new Set(filteredComments.map(c => c.id));
      setSelectedIds(newSet);
    }
  };

  // Filtered comments logic
  const filteredComments = comments.filter(c => {
    const matchesSearch = 
      c.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      `chapter ${c.chapterId}`.includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (selectedChapterFilter !== 'all' && `${c.chapterId}` !== selectedChapterFilter) {
      return false;
    }

    return true;
  });

  // Unique list of chapter numbers that have comments
  const chaptersWithComments = Array.from(new Set(comments.map(c => c.chapterId))).sort((a, b) => a - b);

  // If not authenticated, show password prompt screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-theme-base text-theme-primary px-4">
        <div className="w-full max-w-md p-8 rounded-3xl bg-theme-surface border border-theme shadow-2xl space-y-6">
          
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base flex items-center justify-center mx-auto shadow-xl">
              <Lock className="w-7 h-7" />
            </div>
            <h1 className="font-cinzel font-bold text-2xl text-theme-primary">
              Admin Portal
            </h1>
            <p className="text-xs text-theme-secondary font-mono">
              Restricted Area • Password Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-theme-secondary mb-1.5 font-cinzel">
                Admin Password
              </label>
              <input
                type="password"
                placeholder="Enter password..."
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-theme-base border border-theme text-sm text-theme-primary focus:outline-none focus:border-[var(--color-primary)] font-mono"
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold text-sm shadow-xl hover:scale-[1.02] active:scale-95 transition-all"
            >
              Access Admin Console
            </button>
          </form>

          <div className="text-center pt-2">
            <Link href="/" className="text-xs text-theme-muted hover:text-theme-primary transition-colors">
              ← Return to Reader Homepage
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // Authenticated Admin Dashboard UI
  return (
    <div className="min-h-screen bg-theme-base text-theme-primary transition-colors duration-300">
      
      {/* Admin Top Header */}
      <header className="border-b border-theme bg-theme-surface/80 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="font-cinzel font-bold text-lg text-theme-primary">
                Regressor&apos;s Tale • Admin Console
              </h1>
              <p className="text-[10px] font-mono text-emerald-400">
                Authenticated • Full Moderation Privileges
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchAdminData()}
              className="p-2 rounded-xl border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary transition-all"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs font-semibold transition-all"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Logout</span>
            </button>
          </div>

        </div>
      </header>

      {/* Admin Main Body */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {/* Top Overview Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="p-5 rounded-3xl bg-theme-surface border border-theme space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-theme-secondary">
              <span className="text-xs font-cinzel font-bold">Total Comments</span>
              <MessageSquare className="w-4 h-4 text-[var(--color-primary)]" />
            </div>
            <p className="font-cinzel font-black text-3xl text-theme-primary">
              {stats.totalComments}
            </p>
            <p className="text-[11px] text-theme-muted">
              Across {chaptersWithComments.length} active chapter discussions
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-theme-surface border border-theme space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-theme-secondary">
              <span className="text-xs font-cinzel font-bold">Total Chapter Views</span>
              <Eye className="w-4 h-4 text-[var(--color-secondary)]" />
            </div>
            <p className="font-cinzel font-black text-3xl text-theme-primary">
              {stats.totalViews.toLocaleString()}
            </p>
            <p className="text-[11px] text-theme-muted">
              Recorded read views across all 869 chapters
            </p>
          </div>

          <div className="p-5 rounded-3xl bg-theme-surface border border-theme space-y-2 shadow-lg">
            <div className="flex items-center justify-between text-theme-secondary">
              <span className="text-xs font-cinzel font-bold">Selected Items</span>
              <CheckSquare className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="font-cinzel font-black text-3xl text-emerald-400">
              {selectedIds.size}
            </p>
            <p className="text-[11px] text-theme-muted">
              Ready for mass deletion
            </p>
          </div>

        </div>

        {/* Action feedback notification toast */}
        {actionFeedback && (
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2 shadow-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{actionFeedback}</span>
          </div>
        )}

        {/* Comment Moderation Header Bar */}
        <div className="p-4 sm:p-5 rounded-3xl bg-theme-surface border border-theme space-y-4 shadow-xl">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            
            {/* Search Box */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-theme-muted" />
              <input
                type="text"
                placeholder="Search comment text, author, or chapter number..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-theme-base border border-theme text-xs text-theme-primary focus:outline-none focus:border-[var(--color-primary)]"
              />
            </div>

            {/* Chapter Filter Dropdown */}
            <div className="flex items-center gap-2 shrink-0">
              <Filter className="w-4 h-4 text-theme-muted" />
              <select
                value={selectedChapterFilter}
                onChange={(e) => setSelectedChapterFilter(e.target.value)}
                className="bg-theme-base border border-theme text-xs font-semibold text-theme-primary px-3 py-2.5 rounded-xl cursor-pointer focus:outline-none focus:border-[var(--color-primary)]"
              >
                <option value="all">All Chapters ({comments.length})</option>
                {chaptersWithComments.map(ch => (
                  <option key={ch} value={ch}>
                    Chapter {ch} ({comments.filter(c => c.chapterId === ch).length})
                  </option>
                ))}
              </select>
            </div>

          </div>

          {/* Mass Actions Toolbar */}
          <div className="flex items-center justify-between pt-3 border-t border-theme text-xs">
            
            <button
              onClick={toggleSelectAllFiltered}
              className="flex items-center gap-2 font-semibold text-theme-secondary hover:text-theme-primary transition-colors"
            >
              {selectedIds.size === filteredComments.length && filteredComments.length > 0 ? (
                <CheckSquare className="w-4 h-4 text-[var(--color-primary)]" />
              ) : (
                <Square className="w-4 h-4" />
              )}
              <span>
                Select All on Page ({filteredComments.length})
              </span>
            </button>

            {/* MASS DELETE BUTTON */}
            <button
              onClick={handleDeleteBulk}
              disabled={selectedIds.size === 0 || isDeleting}
              className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-40 disabled:hover:bg-red-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2"
              title="Delete all selected comments at once"
            >
              <Trash2 className="w-4 h-4" />
              <span>Mass Delete ({selectedIds.size})</span>
            </button>

          </div>

        </div>

        {/* Comments Data List / Table */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="py-20 text-center space-y-3">
              <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="font-cinzel text-xs text-theme-secondary">Loading Admin Comments...</p>
            </div>
          ) : filteredComments.length > 0 ? (
            filteredComments.map((comment) => {
              const isSelected = selectedIds.has(comment.id);
              return (
                <div
                  key={comment.id}
                  className={`p-4 sm:p-5 rounded-2xl border transition-all space-y-3 ${
                    isSelected
                      ? 'border-red-500/50 bg-red-500/5'
                      : 'border-theme bg-theme-surface hover:border-[var(--color-primary)]/40'
                  }`}
                >
                  {/* Card Top Row: Checkbox, Chapter Link, Author & Date */}
                  <div className="flex items-center justify-between gap-3 pb-2 border-b border-theme/60">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => toggleSelectComment(comment.id)}
                        className="text-theme-secondary hover:text-theme-primary transition-colors p-0.5"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-4 h-4 text-red-400" />
                        ) : (
                          <Square className="w-4 h-4 text-theme-muted" />
                        )}
                      </button>

                      <Link
                        href={`/read/${comment.chapterId}#comments`}
                        target="_blank"
                        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-theme-base border border-theme text-xs font-mono font-bold text-[var(--color-secondary)] hover:text-[var(--color-primary)] transition-colors"
                      >
                        <span>Ch. {comment.chapterId}</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>

                      <span className="font-cinzel font-bold text-xs sm:text-sm text-theme-primary">
                        {comment.author}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-theme-muted font-mono">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>

                      <button
                        onClick={() => handleDeleteSingle(comment.id)}
                        disabled={isDeleting}
                        className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                        title="Delete Single Comment"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Comment Body Rendered with Markdown */}
                  <div className="pl-7 text-xs sm:text-sm text-theme-primary">
                    <MarkdownRenderer content={comment.content} />
                  </div>

                </div>
              );
            })
          ) : (
            <div className="py-16 text-center text-xs text-theme-muted border border-theme rounded-3xl bg-theme-surface space-y-2">
              <MessageSquare className="w-8 h-8 text-theme-muted mx-auto" />
              <p className="font-cinzel font-bold text-sm text-theme-primary">No Comments Found</p>
              <p>Try clearing filters or search query.</p>
            </div>
          )}
        </div>

      </main>

    </div>
  );
}
