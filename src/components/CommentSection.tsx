'use client';

import React, { useState, useEffect, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { getMyCommentIds, saveMyCommentId, removeMyCommentId } from '@/lib/cookies';
import { 
  MessageSquare, 
  Send, 
  Eye, 
  Bold, 
  Italic, 
  Link as LinkIcon, 
  Quote, 
  Code, 
  ThumbsUp, 
  Sparkles,
  UserCheck,
  CheckCircle2,
  Trash2
} from 'lucide-react';

interface Comment {
  id: string;
  chapterId: number;
  author: string;
  content: string;
  createdAt: string;
  likes?: number;
}

interface CommentSectionProps {
  chapterId: number;
  chapterTitle?: string;
}

export default function CommentSection({ chapterId, chapterTitle }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [likedComments, setLikedComments] = useState<Record<string, boolean>>({});
  const [myCommentIds, setMyCommentIds] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Load user comment IDs from cookie on mount
  useEffect(() => {
    setMyCommentIds(getMyCommentIds());
  }, []);

  // Load comments for current chapter
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/chapters/${chapterId}/comments`);
      if (res.ok) {
        const data = await res.json();
        setComments(data.comments || []);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [chapterId]);

  // Handle Comment Submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!content.trim()) {
      setErrorMsg('Please write a comment before posting.');
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await fetch(`/api/chapters/${chapterId}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author: author || 'Guest', content })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to post comment');
      }

      if (data.comment && data.comment.id) {
        const updatedMyComments = saveMyCommentId(data.comment.id);
        setMyCommentIds(updatedMyComments);
      }

      setContent('');
      setActiveTab('write');
      setSuccessMsg('Comment posted successfully!');
      fetchComments();

      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong while posting.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Erase User's Own Comment
  const handleEraseComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to erase your comment?')) return;

    try {
      const res = await fetch(`/api/chapters/${chapterId}/comments`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ commentId })
      });

      if (res.ok) {
        const updatedMyComments = removeMyCommentId(commentId);
        setMyCommentIds(updatedMyComments);
        fetchComments();
      } else {
        alert('Failed to erase comment');
      }
    } catch (err) {
      console.error('Error erasing comment:', err);
    }
  };

  // Helper to insert Markdown syntax around selection in textarea
  const insertMarkdown = (prefix: string, suffix: string = '', defaultText: string = '') => {
    if (!textareaRef.current) return;
    const el = textareaRef.current;
    const start = el.selectionStart;
    const end = el.selectionEnd;
    const selected = content.substring(start, end) || defaultText;

    const newText = content.substring(0, start) + prefix + selected + suffix + content.substring(end);
    setContent(newText);

    setTimeout(() => {
      el.focus();
      el.setSelectionRange(start + prefix.length, start + prefix.length + selected.length);
    }, 50);
  };

  const handleLike = (commentId: string) => {
    const isAlreadyLiked = likedComments[commentId];
    const nextState = !isAlreadyLiked;

    setLikedComments(prev => ({ ...prev, [commentId]: nextState }));

    setComments(current => 
      current.map(c => {
        if (c.id === commentId) {
          return {
            ...c,
            likes: Math.max(0, (c.likes || 0) + (nextState ? 1 : -1))
          };
        }
        return c;
      })
    );
  };

  const formatDate = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;

      return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'Recently';
    }
  };

  return (
    <section id="comments" className="mt-12 pt-8 border-t border-theme space-y-6">
      
      {/* Section Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-theme-surface border border-theme text-[var(--color-primary)]">
            <MessageSquare className="w-5 h-5" />
          </div>
          <div>
            <h2 className="font-cinzel font-bold text-xl text-theme-primary">
              Cultivator Discussion
            </h2>
            <p className="text-xs text-theme-secondary font-medium">
              Chapter {chapterId} • {comments.length} {comments.length === 1 ? 'Comment' : 'Comments'}
            </p>
          </div>
        </div>

        <span className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold">
          <UserCheck className="w-3.5 h-3.5" />
          No Sign-In Required
        </span>
      </div>

      {/* Comment Form Composer */}
      <div className="p-4 sm:p-6 rounded-3xl bg-theme-surface border border-theme shadow-xl space-y-4">
        
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Author Name Input */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
            <label className="text-xs font-bold font-cinzel text-theme-secondary whitespace-nowrap">
              Display Name:
            </label>
            <input
              type="text"
              placeholder="Guest (Optional)"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="flex-1 w-full px-3.5 py-2 rounded-xl bg-theme-base border border-theme text-xs text-theme-primary focus:outline-none focus:border-[var(--color-primary)] transition-colors"
              maxLength={40}
            />
          </div>

          {/* Editor Header: Markdown Controls & Write/Preview Tabs */}
          <div className="flex items-center justify-between gap-2 border-b border-theme pb-2 text-xs">
            
            {/* Quick Markdown Format Buttons */}
            <div className="flex items-center gap-1 overflow-x-auto">
              <button
                type="button"
                onClick={() => insertMarkdown('**', '**', 'bold text')}
                className="p-1.5 rounded-lg border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary"
                title="Bold (**text**)"
              >
                <Bold className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('*', '*', 'italic text')}
                className="p-1.5 rounded-lg border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary"
                title="Italic (*text*)"
              >
                <Italic className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('[', '](https://example.com)', 'link text')}
                className="p-1.5 rounded-lg border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary"
                title="Hyperlink ([text](url))"
              >
                <LinkIcon className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('> ', '', 'quote text')}
                className="p-1.5 rounded-lg border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary"
                title="Blockquote (> text)"
              >
                <Quote className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => insertMarkdown('`', '`', 'code')}
                className="p-1.5 rounded-lg border border-theme bg-theme-base hover:bg-theme-card text-theme-secondary hover:text-theme-primary"
                title="Inline Code (`code`)"
              >
                <Code className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Write vs Preview Tabs */}
            <div className="flex items-center gap-1 bg-theme-base p-1 rounded-xl border border-theme shrink-0">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all ${
                  activeTab === 'write'
                    ? 'bg-theme-card text-[var(--color-primary)] shadow-sm'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                Write
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                  activeTab === 'preview'
                    ? 'bg-theme-card text-[var(--color-primary)] shadow-sm'
                    : 'text-theme-muted hover:text-theme-primary'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Preview
              </button>
            </div>

          </div>

          {/* Comment Body Field or Live Markdown Preview */}
          {activeTab === 'write' ? (
            <textarea
              ref={textareaRef}
              rows={4}
              placeholder="Share your thoughts on this chapter... Supports Markdown formatting & hyperlinks! e.g., **bold**, [link](https://...), > quote"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-3.5 rounded-2xl bg-theme-base border border-theme text-xs sm:text-sm text-theme-primary focus:outline-none focus:border-[var(--color-primary)] leading-relaxed resize-y"
            />
          ) : (
            <div className="min-h-[100px] p-3.5 rounded-2xl bg-theme-base border border-theme text-xs sm:text-sm text-theme-primary">
              {content.trim() ? (
                <MarkdownRenderer content={content} />
              ) : (
                <span className="text-theme-muted italic">Nothing to preview yet. Write some markdown above!</span>
              )}
            </div>
          )}

          {/* Feedback Messages */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              <span>{successMsg}</span>
            </div>
          )}

          {/* Form Action Controls */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-[11px] text-theme-muted hidden sm:inline">
              ✨ MD formatted comments &amp; hyperlinks allowed
            </span>

            <button
              type="submit"
              disabled={isSubmitting || !content.trim()}
              className="w-full sm:w-auto ml-auto px-6 py-2.5 rounded-2xl bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold text-xs shadow-lg hover:scale-105 active:scale-95 disabled:opacity-50 disabled:scale-100 transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" />
                  <span>Post Comment</span>
                </>
              )}
            </button>
          </div>

        </form>

      </div>

      {/* Comments List */}
      <div className="space-y-3">
        {isLoading ? (
          <div className="py-10 text-center space-y-2">
            <div className="w-6 h-6 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs text-theme-muted">Loading chapter comments...</p>
          </div>
        ) : comments.length > 0 ? (
          comments.map((comment) => {
            const isLiked = likedComments[comment.id];
            const isMyComment = myCommentIds.includes(comment.id);

            return (
              <div
                key={comment.id}
                className={`p-4 sm:p-5 rounded-2xl bg-theme-surface border space-y-2.5 transition-all shadow-sm ${
                  isMyComment 
                    ? 'border-[var(--color-primary)]/60 bg-theme-card/30' 
                    : 'border-theme hover:border-[var(--color-primary)]/40'
                }`}
              >
                {/* Comment Author Header */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    {/* User Avatar Gradient */}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-[var(--color-primary)] to-[var(--color-secondary)] text-theme-base font-bold font-cinzel text-xs flex items-center justify-center shadow-md">
                      {comment.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-cinzel font-bold text-xs sm:text-sm text-theme-primary">
                          {comment.author}
                        </h4>
                        {isMyComment && (
                          <span className="px-1.5 py-0.5 rounded bg-[var(--color-primary)]/20 text-[var(--color-primary)] font-semibold text-[10px] border border-[var(--color-primary)]/40">
                            You
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-theme-muted font-mono block">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Erase Own Comment Button */}
                    {isMyComment && (
                      <button
                        onClick={() => handleEraseComment(comment.id)}
                        className="p-1.5 rounded-lg border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 text-red-400 text-xs transition-all"
                        title="Erase your comment"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}

                    <button
                      onClick={() => handleLike(comment.id)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs transition-all ${
                        isLiked
                          ? 'border-[var(--color-primary)] bg-theme-card text-[var(--color-primary)] font-bold'
                          : 'border-theme bg-theme-base text-theme-muted hover:text-theme-primary'
                      }`}
                      title="Like comment"
                    >
                      <ThumbsUp className={`w-3.5 h-3.5 ${isLiked ? 'fill-current' : ''}`} />
                      <span>{(comment.likes || 0) > 0 ? comment.likes : ''}</span>
                    </button>
                  </div>
                </div>

                {/* Comment Formatted Body */}
                <div className="pl-10 text-theme-primary">
                  <MarkdownRenderer content={comment.content} />
                </div>
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center border border-theme rounded-3xl bg-theme-surface/50 space-y-2">
            <Sparkles className="w-8 h-8 text-[var(--color-primary)] mx-auto opacity-70" />
            <p className="font-cinzel font-bold text-sm text-theme-primary">No comments yet</p>
            <p className="text-xs text-theme-secondary max-w-sm mx-auto">
              Be the first cultivator to leave a comment or share your insights on Chapter {chapterId}!
            </p>
          </div>
        )}
      </div>

    </section>
  );
}
