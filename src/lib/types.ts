export type SchoolType = 'particular' | 'publica' | 'bilingue' | 'federal' | 'estadual' | 'municipal';
export type SchoolStage = 'infantil' | 'fundamental' | 'medio' | 'tecnico' | 'integral';
export type UserRole = 'pai' | 'profissional' | 'escola';

export interface CategoryRating {
  label: string;
  value: number;
}

export interface School {
  id: string;
  name: string;
  slug: string;
  type: SchoolType;
  stages: SchoolStage[];
  address: string;
  city: string;
  state: string;
  neighborhood: string;
  lat: number;
  lng: number;
  rating: number;
  reviewCount: number;
  avgPrice: number;
  priceMin: number;
  priceMax: number;
  isVerified: boolean;
  isAutismFriendly: boolean;
  isClaimed: boolean;
  categories: CategoryRating[];
  description: string;
  phone: string;
  website: string;
  photos: string[];
  highlights: string[];
}

export interface Review {
  id: string;
  schoolId: string;
  authorName: string;
  authorAvatar: string;
  isAnonymous: boolean;
  rating: number;
  categories: CategoryRating[];
  comment: string;
  pros: string;
  cons: string;
  wouldRecommend: boolean;
  monthlyFee: number;
  stage: string;
  year: number;
  createdAt: string;
  helpful: number;
}

export interface Professional {
  id: string;
  name: string;
  specialty: string;
  city: string;
  state: string;
  modality: 'online' | 'presencial' | 'ambos';
  rating: number;
  reviewCount: number;
  pricePerSession: number;
  bio: string;
  avatar: string;
  tags: string[];
  specialties?: string[];
  phone: string;
  whatsapp: string;
  website?: string;
  isVerified?: boolean;
}
