import { NextResponse } from 'next/server';
import { getSchoolsByBbox, getSchoolsSample, searchSchools } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() ?? '';
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');

  let schools;
  if (q.length >= 2) {
    schools = await searchSchools(q);
  } else if (!isNaN(lat) && !isNaN(lng)) {
    schools = await getSchoolsByBbox(lat, lng);
  } else {
    schools = await getSchoolsSample();
  }

  return NextResponse.json(schools);
}
