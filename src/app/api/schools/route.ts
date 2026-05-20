import { NextResponse } from 'next/server';
import { getAllSchools } from '@/lib/db';

export async function GET() {
  const schools = await getAllSchools();
  return NextResponse.json(schools);
}
