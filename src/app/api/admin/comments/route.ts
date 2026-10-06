import { NextRequest, NextResponse } from 'next/server';
import { getComments, deleteComment, deleteCommentsBulk, getViewsMap } from '@/lib/db';

const ADMIN_PASSWORD = 'Rtoc';

function isAuthenticated(req: NextRequest, bodyPassword?: string): boolean {
  const headerPwd = req.headers.get('x-admin-password');
  const urlPwd = req.nextUrl.searchParams.get('password');
  return headerPwd === ADMIN_PASSWORD || urlPwd === ADMIN_PASSWORD || bodyPassword === ADMIN_PASSWORD;
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: 'Unauthorized: Incorrect or missing password' }, { status: 401 });
  }

  try {
    const comments = getComments();
    const viewsMap = getViewsMap();
    const totalViews = Object.values(viewsMap).reduce((a, b) => a + b, 0);

    return NextResponse.json({
      success: true,
      comments,
      stats: {
        totalComments: comments.length,
        totalViews,
        viewsMap
      }
    });
  } catch (error) {
    console.error('Admin API GET Error:', error);
    return NextResponse.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    
    if (!isAuthenticated(req, body.password)) {
      return NextResponse.json({ error: 'Unauthorized: Incorrect or missing password' }, { status: 401 });
    }

    const { commentId, commentIds } = body;

    if (Array.isArray(commentIds) && commentIds.length > 0) {
      const count = deleteCommentsBulk(commentIds);
      return NextResponse.json({ success: true, message: `Successfully deleted ${count} comment(s)`, count });
    }

    if (commentId && typeof commentId === 'string') {
      const success = deleteComment(commentId);
      if (success) {
        return NextResponse.json({ success: true, message: 'Comment deleted successfully', count: 1 });
      } else {
        return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
      }
    }

    return NextResponse.json({ error: 'Must provide commentId or commentIds array' }, { status: 400 });
  } catch (error) {
    console.error('Admin API DELETE Error:', error);
    return NextResponse.json({ error: 'Failed to delete comment(s)' }, { status: 500 });
  }
}
