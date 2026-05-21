import { NextResponse } from 'next/server';
import { getSchoolsByBbox, getSchoolsSample } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') ?? '');
  const lng = parseFloat(searchParams.get('lng') ?? '');

  const schools = (!isNaN(lat) && !isNaN(lng))
    ? await getSchoolsByBbox(lat, lng)
    : await getSchoolsSample();

  return NextResponse.json(schools);
}
