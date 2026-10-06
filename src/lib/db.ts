import fs from 'fs';
import path from 'path';

export interface Comment {
  id: string;
  chapterId: number;
  author: string;
  content: string;
  createdAt: string;
  likes?: number;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const COMMENTS_FILE = path.join(DATA_DIR, 'comments.json');
const VIEWS_FILE = path.join(DATA_DIR, 'views.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Comments Helper Functions
export function getComments(): Comment[] {
  ensureDataDir();
  if (!fs.existsSync(COMMENTS_FILE)) {
    return [];
  }
  try {
    const raw = fs.readFileSync(COMMENTS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading comments.json:', err);
    return [];
  }
}

export function saveComments(comments: Comment[]): void {
  ensureDataDir();
  try {
    fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving comments.json:', err);
  }
}

export function getCommentsForChapter(chapterId: number): Comment[] {
  const all = getComments();
  return all
    .filter(c => c.chapterId === chapterId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export function sanitizeInput(str: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

export function addComment(chapterId: number, author: string, content: string): Comment {
  const all = getComments();
  const cleanAuthor = sanitizeInput(author.trim()) || 'Guest';
  const cleanContent = sanitizeInput(content.trim());

  const newComment: Comment = {
    id: `comment_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    chapterId,
    author: cleanAuthor,
    content: cleanContent,
    createdAt: new Date().toISOString(),
    likes: 0
  };
  all.push(newComment);
  saveComments(all);
  return newComment;
}

export function deleteComment(commentId: string): boolean {
  const all = getComments();
  const filtered = all.filter(c => c.id !== commentId);
  if (filtered.length !== all.length) {
    saveComments(filtered);
    return true;
  }
  return false;
}

export function deleteCommentsBulk(commentIds: string[]): number {
  const all = getComments();
  const idsSet = new Set(commentIds);
  const filtered = all.filter(c => !idsSet.has(c.id));
  const deletedCount = all.length - filtered.length;
  if (deletedCount > 0) {
    saveComments(filtered);
  }
  return deletedCount;
}

// Views Helper Functions
export function getViewsMap(): Record<number, number> {
  ensureDataDir();
  if (!fs.existsSync(VIEWS_FILE)) {
    return {};
  }
  try {
    const raw = fs.readFileSync(VIEWS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading views.json:', err);
    return {};
  }
}

export function saveViewsMap(views: Record<number, number>): void {
  ensureDataDir();
  try {
    fs.writeFileSync(VIEWS_FILE, JSON.stringify(views, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving views.json:', err);
  }
}

export function getViewsForChapter(chapterId: number): number {
  const viewsMap = getViewsMap();
  return viewsMap[chapterId] || 0;
}

export function incrementViewForChapter(chapterId: number): number {
  const viewsMap = getViewsMap();
  const current = viewsMap[chapterId] || 0;
  const updated = current + 1;
  viewsMap[chapterId] = updated;
  saveViewsMap(viewsMap);
  return updated;
}
