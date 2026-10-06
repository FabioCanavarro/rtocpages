import { NextRequest, NextResponse } from 'next/server';
import { getCommentsForChapter, addComment, deleteComment } from '@/lib/db';

interface RouteParams {
  params: Promise<{ chapterId: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const chapterId = parseInt(resolvedParams.chapterId, 10);

    if (isNaN(chapterId) || chapterId < 1) {
      return NextResponse.json({ error: 'Invalid chapter ID' }, { status: 400 });
    }

    const comments = getCommentsForChapter(chapterId);
    return NextResponse.json({ chapterId, comments });
  } catch (error) {
    console.error('API Error in GET comments:', error);
    return NextResponse.json({ error: 'Failed to fetch comments' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const chapterId = parseInt(resolvedParams.chapterId, 10);

    if (isNaN(chapterId) || chapterId < 1) {
      return NextResponse.json({ error: 'Invalid chapter ID' }, { status: 400 });
    }

    const body = await req.json();
    const { author, content } = body;

    if (!content || typeof content !== 'string' || content.trim().length === 0) {
      return NextResponse.json({ error: 'Comment content cannot be empty' }, { status: 400 });
    }

    if (content.length > 5000) {
      return NextResponse.json({ error: 'Comment exceeds maximum length of 5000 characters' }, { status: 400 });
    }

    const newComment = addComment(chapterId, author || '', content);
    return NextResponse.json({ success: true, comment: newComment }, { status: 201 });
  } catch (error) {
    console.error('API Error in POST comment:', error);
    return NextResponse.json({ error: 'Failed to post comment' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json();
    const { commentId } = body;

    if (!commentId || typeof commentId !== 'string') {
      return NextResponse.json({ error: 'Invalid comment ID' }, { status: 400 });
    }

    const success = deleteComment(commentId);
    if (success) {
      return NextResponse.json({ success: true, message: 'Comment erased successfully' });
    } else {
      return NextResponse.json({ error: 'Comment not found' }, { status: 404 });
    }
  } catch (error) {
    console.error('API Error in DELETE comment:', error);
    return NextResponse.json({ error: 'Failed to delete comment' }, { status: 500 });
  }
}
