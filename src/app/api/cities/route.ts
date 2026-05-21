import { NextResponse } from 'next/server';
import { searchCities } from '@/lib/db';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q')?.trim() ?? '';
  if (q.length < 2) return NextResponse.json([]);
  const cities = await searchCities(q);
  return NextResponse.json(cities);
}
