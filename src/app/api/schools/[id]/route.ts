import { NextResponse } from 'next/server';
import { getSchoolByIdOrSlug, getReviewsForSchool } from '@/lib/db';

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const school = await getSchoolByIdOrSlug(params.id);
  if (!school) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  const reviews = await getReviewsForSchool(school.id);
  return NextResponse.json({ school, reviews });
}
