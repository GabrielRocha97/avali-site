import { supabase } from './supabase';
import type { School, Review } from './types';

function rowToSchool(r: Record<string, unknown>): School {
  return {
    id: r.id as string,
    name: r.name as string,
    slug: (r.slug as string) || (r.id as string),
    type: r.type as School['type'],
    stages: (r.stages as School['stages']) || [],
    address: (r.address as string) || '',
    city: r.city as string,
    state: r.state as string,
    neighborhood: (r.neighborhood as string) || '',
    lat: (r.lat as number) || 0,
    lng: (r.lng as number) || 0,
    rating: (r.rating as number) || 0,
    reviewCount: (r.review_count as number) || 0,
    avgPrice: (r.avg_price as number) || 0,
    priceMin: (r.price_min as number) || 0,
    priceMax: (r.price_max as number) || 0,
    isVerified: (r.is_verified as boolean) || false,
    isAutismFriendly: (r.is_autism_friendly as boolean) || false,
    isClaimed: (r.is_claimed as boolean) || false,
    categories: (r.categories as School['categories']) || [],
    description: (r.description as string) || '',
    phone: (r.phone as string) || '',
    website: (r.website as string) || '',
    photos: (r.photos as string[]) || [],
    highlights: (r.highlights as string[]) || [],
  };
}

function rowToReview(r: Record<string, unknown>): Review {
  return {
    id: r.id as string,
    schoolId: r.school_id as string,
    authorName: r.author_name as string,
    authorAvatar: '',
    isAnonymous: (r.is_anonymous as boolean) || false,
    rating: r.rating as number,
    categories: (r.categories as Review['categories']) || [],
    comment: r.comment as string,
    pros: (r.pros as string) || '',
    cons: (r.cons as string) || '',
    wouldRecommend: (r.would_recommend as boolean) ?? true,
    monthlyFee: (r.monthly_fee as number) || 0,
    stage: (r.stage as string) || '',
    year: (r.year as number) || 2024,
    createdAt: r.created_at as string,
    helpful: (r.helpful as number) || 0,
  };
}

export async function getAllSchools(): Promise<School[]> {
  const all: School[] = [];
  const PAGE = 1000;
  let from = 0;
  while (true) {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('name', { ascending: true })
      .range(from, from + PAGE - 1);
    if (error) { console.error('[db getAllSchools] error:', error); break; }
    if (!data || data.length === 0) break;
    all.push(...data.map(rowToSchool));
    if (data.length < PAGE) break;
    from += PAGE;
  }
  return all;
}

export async function getSchoolByIdOrSlug(idOrSlug: string): Promise<School | null> {
  const { data, error } = await supabase
    .from('schools')
    .select('*')
    .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
    .single();
  if (error || !data) return null;
  return rowToSchool(data);
}

export async function getReviewsForSchool(schoolId: string): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('school_id', schoolId)
    .order('created_at', { ascending: false });
  if (error || !data) return [];
  return data.map(rowToReview);
}
