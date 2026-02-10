import {
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  increment,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import type { SchoolReview, ReviewFormData } from '../types/review';

const COLLECTION_NAME = 'schoolReviews';

// Create a new review
export async function createReview(
  schoolId: string,
  data: ReviewFormData,
  userId: string,
  userName: string,
  userEmail: string
): Promise<string> {
  try {
    const reviewData = {
      schoolId,
      authorId: userId,
      authorName: userName,
      authorEmail: userEmail,
      rating: data.rating,
      title: data.title,
      content: data.content,
      pros: data.pros || '',
      cons: data.cons || '',
      isVerified: false,
      helpfulCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COLLECTION_NAME), reviewData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
}

// Get all reviews for a school
export async function getReviewsBySchoolId(schoolId: string): Promise<SchoolReview[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('schoolId', '==', schoolId),
      orderBy('createdAt', 'desc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SchoolReview[];
  } catch (error) {
    console.error('Error getting reviews:', error);
    throw error;
  }
}

// Get recent reviews for a school (for preview)
export async function getRecentReviews(schoolId: string, limitCount: number = 3): Promise<SchoolReview[]> {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('schoolId', '==', schoolId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as SchoolReview[];
  } catch (error) {
    console.error('Error getting recent reviews:', error);
    throw error;
  }
}

// Get review by ID
export async function getReviewById(id: string): Promise<SchoolReview | null> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as SchoolReview;
    }
    return null;
  } catch (error) {
    console.error('Error getting review:', error);
    throw error;
  }
}

// Update review
export async function updateReview(id: string, data: Partial<ReviewFormData>): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating review:', error);
    throw error;
  }
}

// Delete review
export async function deleteReview(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, id));
  } catch (error) {
    console.error('Error deleting review:', error);
    throw error;
  }
}

// Mark review as helpful
export async function markReviewHelpful(id: string): Promise<void> {
  try {
    const docRef = doc(db, COLLECTION_NAME, id);
    await updateDoc(docRef, {
      helpfulCount: increment(1),
    });
  } catch (error) {
    console.error('Error marking review helpful:', error);
    throw error;
  }
}

// Get average rating for a school
export async function getSchoolAverageRating(schoolId: string): Promise<{ average: number; count: number }> {
  try {
    const reviews = await getReviewsBySchoolId(schoolId);
    if (reviews.length === 0) {
      return { average: 0, count: 0 };
    }
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return {
      average: Math.round((total / reviews.length) * 10) / 10,
      count: reviews.length,
    };
  } catch (error) {
    console.error('Error calculating average rating:', error);
    return { average: 0, count: 0 };
  }
}
