// Gateway to Korea - TypeScript Types

export interface School {
  id: string;
  name: string;
  nameEn?: string;
  nameRu?: string;
  nameDe?: string;
  country: string;
  city: string;
  description: string;
  descriptionEn?: string;
  descriptionRu?: string;
  descriptionDe?: string;
  logoUrl?: string;
  headerImageUrl?: string;
  websiteUrl?: string;
  rating: number;
  studentCount: number;
  programs: string[];
  jobOpportunityLevel: 'high' | 'medium' | 'low';
  region: 'northern-europe' | 'western-europe' | 'eastern-europe' | 'russia' | 'central-asia';
  oneLineFeedback?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FilterOptions {
  region?: string;
  programs?: string[];
  jobOpportunityLevel?: string[];
  minRating?: number;
  search?: string;
}

export interface Review {
  id: string;
  schoolId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  content: string;
  verifiedStudent: boolean;
  helpfulCount: number;
  createdAt: string;
  updatedAt?: string;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  country?: string;
  phone?: string;
  educationBackground?: {
    degree: string;
    university: string;
    gpa?: number;
    graduationYear?: number;
  };
  profileCompleted: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface Application {
  id: string;
  userId: string;
  schoolId: string;
  program: string;
  status: 'draft' | 'submitted' | 'accepted' | 'rejected';
  submittedAt?: string;
  documents?: {
    type: string;
    url: string;
    uploadedAt: string;
  }[];
  createdAt: string;
  updatedAt?: string;
}

// i18n types
export type Locale = 'en' | 'ru' | 'de';

export interface LocalizedContent {
  en: string;
  ru: string;
  de: string;
}
