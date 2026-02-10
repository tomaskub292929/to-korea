import { Timestamp } from 'firebase/firestore';

export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  authorEmail: string;
  category: PostCategory;
  viewCount: number;
  likeCount: number;
  commentCount: number;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export interface Comment {
  id: string;
  postId: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Timestamp | Date;
  updatedAt: Timestamp | Date;
}

export type PostCategory = 'general' | 'question' | 'tip' | 'review' | 'news';

export const POST_CATEGORIES: { value: PostCategory; label: string; emoji: string }[] = [
  { value: 'general', label: 'General', emoji: '💬' },
  { value: 'question', label: 'Question', emoji: '❓' },
  { value: 'tip', label: 'Tips & Advice', emoji: '💡' },
  { value: 'review', label: 'School Review', emoji: '⭐' },
  { value: 'news', label: 'News', emoji: '📰' },
];

export interface PostFormData {
  title: string;
  content: string;
  category: PostCategory;
}
