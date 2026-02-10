import { Timestamp } from 'firebase/firestore';

export interface SchoolReview {
  id: string;
  schoolId: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  rating: number; // 1-5 stars
  title: string;
  content: string;
  pros?: string; // 장점
  cons?: string; // 단점
  isVerified: boolean; // 실제 재학생/졸업생 여부
  helpfulCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface ReviewFormData {
  rating: number;
  title: string;
  content: string;
  pros?: string;
  cons?: string;
}
