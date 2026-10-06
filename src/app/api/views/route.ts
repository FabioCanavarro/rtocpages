import { NextResponse } from 'next/server';
import { getViewsMap } from '@/lib/db';

export async function GET() {
  try {
    const viewsMap = getViewsMap();
    const totalViews = Object.values(viewsMap).reduce((acc, curr) => acc + curr, 0);
    return NextResponse.json({ views: viewsMap, totalViews });
  } catch (error) {
    console.error('API Error in GET all views:', error);
    return NextResponse.json({ error: 'Failed to fetch views map' }, { status: 500 });
  }
}
