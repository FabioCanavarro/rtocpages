import { NextRequest, NextResponse } from 'next/server';
import { getViewsForChapter, incrementViewForChapter } from '@/lib/db';

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

    const views = getViewsForChapter(chapterId);
    return NextResponse.json({ chapterId, views });
  } catch (error) {
    console.error('API Error in GET views:', error);
    return NextResponse.json({ error: 'Failed to fetch view count' }, { status: 500 });
  }
}

export async function POST(req: NextRequest, { params }: RouteParams) {
  try {
    const resolvedParams = await params;
    const chapterId = parseInt(resolvedParams.chapterId, 10);

    if (isNaN(chapterId) || chapterId < 1) {
      return NextResponse.json({ error: 'Invalid chapter ID' }, { status: 400 });
    }

    const updatedViews = incrementViewForChapter(chapterId);
    return NextResponse.json({ chapterId, views: updatedViews });
  } catch (error) {
    console.error('API Error in POST view:', error);
    return NextResponse.json({ error: 'Failed to increment view count' }, { status: 500 });
  }
}
