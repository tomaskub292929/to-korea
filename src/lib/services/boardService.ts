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
  Timestamp,
} from 'firebase/firestore';
import { db } from '../firebase.config';
import type { Post, Comment, PostFormData, PostCategory } from '../types/board';

const POSTS_COLLECTION = 'posts';
const COMMENTS_COLLECTION = 'comments';

// ============================================
// Posts CRUD
// ============================================

// Create a new post
export async function createPost(
  data: PostFormData,
  userId: string,
  userName: string,
  userEmail: string
): Promise<string> {
  try {
    const postData = {
      title: data.title,
      content: data.content,
      category: data.category,
      authorId: userId,
      authorName: userName,
      authorEmail: userEmail,
      viewCount: 0,
      likeCount: 0,
      commentCount: 0,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, POSTS_COLLECTION), postData);
    return docRef.id;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

// Get all posts
export async function getAllPosts(category?: PostCategory): Promise<Post[]> {
  try {
    let q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc')
    );

    if (category) {
      q = query(
        collection(db, POSTS_COLLECTION),
        where('category', '==', category),
        orderBy('createdAt', 'desc')
      );
    }

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  } catch (error) {
    console.error('Error getting posts:', error);
    throw error;
  }
}

// Get recent posts (for sidebar)
export async function getRecentPosts(limitCount: number = 5): Promise<Post[]> {
  try {
    const q = query(
      collection(db, POSTS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Post[];
  } catch (error) {
    console.error('Error getting recent posts:', error);
    throw error;
  }
}

// Get post by ID
export async function getPostById(id: string): Promise<Post | null> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as Post;
    }
    return null;
  } catch (error) {
    console.error('Error getting post:', error);
    throw error;
  }
}

// Update post
export async function updatePost(
  id: string,
  data: Partial<PostFormData>
): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp(),
    });
  } catch (error) {
    console.error('Error updating post:', error);
    throw error;
  }
}

// Delete post
export async function deletePost(id: string): Promise<void> {
  try {
    // Delete all comments first
    const commentsQuery = query(
      collection(db, COMMENTS_COLLECTION),
      where('postId', '==', id)
    );
    const commentsSnapshot = await getDocs(commentsQuery);
    const deletePromises = commentsSnapshot.docs.map((doc) =>
      deleteDoc(doc.ref)
    );
    await Promise.all(deletePromises);

    // Delete the post
    await deleteDoc(doc(db, POSTS_COLLECTION, id));
  } catch (error) {
    console.error('Error deleting post:', error);
    throw error;
  }
}

// Increment view count
export async function incrementViewCount(id: string): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      viewCount: increment(1),
    });
  } catch (error) {
    console.error('Error incrementing view count:', error);
  }
}

// Increment like count
export async function toggleLikePost(id: string, add: boolean): Promise<void> {
  try {
    const docRef = doc(db, POSTS_COLLECTION, id);
    await updateDoc(docRef, {
      likeCount: increment(add ? 1 : -1),
    });
  } catch (error) {
    console.error('Error toggling like:', error);
    throw error;
  }
}

// ============================================
// Comments CRUD
// ============================================

// Create comment
export async function createComment(
  postId: string,
  content: string,
  userId: string,
  userName: string
): Promise<string> {
  try {
    const commentData = {
      postId,
      content,
      authorId: userId,
      authorName: userName,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(collection(db, COMMENTS_COLLECTION), commentData);

    // Increment comment count on post
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      commentCount: increment(1),
    });

    return docRef.id;
  } catch (error) {
    console.error('Error creating comment:', error);
    throw error;
  }
}

// Get comments for a post
export async function getCommentsByPostId(postId: string): Promise<Comment[]> {
  try {
    const q = query(
      collection(db, COMMENTS_COLLECTION),
      where('postId', '==', postId),
      orderBy('createdAt', 'asc')
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];
  } catch (error) {
    console.error('Error getting comments:', error);
    throw error;
  }
}

// Delete comment
export async function deleteComment(
  commentId: string,
  postId: string
): Promise<void> {
  try {
    await deleteDoc(doc(db, COMMENTS_COLLECTION, commentId));

    // Decrement comment count on post
    const postRef = doc(db, POSTS_COLLECTION, postId);
    await updateDoc(postRef, {
      commentCount: increment(-1),
    });
  } catch (error) {
    console.error('Error deleting comment:', error);
    throw error;
  }
}
