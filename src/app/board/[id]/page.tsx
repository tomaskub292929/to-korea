'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Eye,
  Heart,
  MessageSquare,
  Clock,
  Edit,
  Trash2,
  Send,
  User,
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import {
  getPostById,
  incrementViewCount,
  toggleLikePost,
  deletePost,
  getCommentsByPostId,
  createComment,
  deleteComment,
} from '@/lib/services/boardService';
import { POST_CATEGORIES } from '@/lib/types/board';
import type { Post, Comment, PostCategory } from '@/lib/types/board';
import { useAuth } from '@/contexts/AuthContext';
import { PostModal } from '@/components/board/PostModal';

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const postId = params.id as string;

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [liked, setLiked] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Comment state
  const [commentText, setCommentText] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [postData, commentsData] = await Promise.all([
          getPostById(postId),
          getCommentsByPostId(postId),
        ]);

        if (!postData) {
          setError('Post not found');
        } else {
          setPost(postData);
          setComments(commentsData);
          // Increment view count
          incrementViewCount(postId);
        }
      } catch (err) {
        console.error('Error fetching post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [postId]);

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'object' && 'toDate' in date
      ? date.toDate()
      : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryInfo = (category: PostCategory) => {
    return POST_CATEGORIES.find(c => c.value === category) || POST_CATEGORIES[0];
  };

  const handleLike = async () => {
    if (!user || !post) return;
    try {
      await toggleLikePost(postId, !liked);
      setLiked(!liked);
      setPost({
        ...post,
        likeCount: post.likeCount + (liked ? -1 : 1),
      });
    } catch (err) {
      console.error('Error toggling like:', err);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      router.push('/board');
    } catch (err) {
      console.error('Error deleting post:', err);
      alert('Failed to delete post');
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !commentText.trim()) return;

    setSubmittingComment(true);
    try {
      const displayName = user.firstName && user.lastName
        ? `${user.firstName} ${user.lastName}`
        : 'Anonymous';
      await createComment(
        postId,
        commentText,
        user.id,
        displayName
      );
      setCommentText('');
      // Refresh comments
      const commentsData = await getCommentsByPostId(postId);
      setComments(commentsData);
      if (post) {
        setPost({ ...post, commentCount: post.commentCount + 1 });
      }
    } catch (err) {
      console.error('Error creating comment:', err);
      alert('Failed to post comment');
    } finally {
      setSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Delete this comment?')) return;
    try {
      await deleteComment(commentId, postId);
      setComments(comments.filter(c => c.id !== commentId));
      if (post) {
        setPost({ ...post, commentCount: post.commentCount - 1 });
      }
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  const handlePostUpdated = async () => {
    setShowEditModal(false);
    const postData = await getPostById(postId);
    if (postData) setPost(postData);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-24 text-center">
          <p className="text-red-500 mb-4">{error || 'Post not found'}</p>
          <Link href="/board" className="text-[var(--leica-orange)] hover:underline">
            Back to Board
          </Link>
        </div>
      </div>
    );
  }

  const catInfo = getCategoryInfo(post.category);
  const isAuthor = user?.id === post.authorId;

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/board"
            className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Board
          </Link>
        </div>

        {/* Post */}
        <article className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">{catInfo.emoji}</span>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">
                {catInfo.label}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {post.title}
            </h1>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div>
                  <p className="font-medium text-gray-900">{post.authorName}</p>
                  <p className="text-sm text-gray-500">{formatDate(post.createdAt)}</p>
                </div>
              </div>
              {isAuthor && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEditModal(true)}
                    className="p-2 text-gray-400 hover:text-[var(--leica-orange)] hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleDelete}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Post Content */}
          <div className="p-6">
            <div className="prose prose-gray max-w-none whitespace-pre-line">
              {post.content}
            </div>
          </div>

          {/* Post Footer */}
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
            <div className="flex items-center gap-6">
              <button
                onClick={handleLike}
                disabled={!user}
                className={`flex items-center gap-2 text-sm transition-colors ${
                  liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                } disabled:opacity-50`}
              >
                <Heart className={`w-5 h-5 ${liked ? 'fill-current' : ''}`} />
                {post.likeCount}
              </button>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <Eye className="w-5 h-5" />
                {post.viewCount}
              </span>
              <span className="flex items-center gap-2 text-sm text-gray-500">
                <MessageSquare className="w-5 h-5" />
                {post.commentCount}
              </span>
            </div>
          </div>
        </article>

        {/* Comments Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Comments ({comments.length})
          </h2>

          {/* Comment Form */}
          {user ? (
            <form onSubmit={handleSubmitComment} className="mb-6">
              <div className="flex gap-3">
                <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex-1">
                  <textarea
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Write a comment..."
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)] resize-none"
                  />
                  <div className="flex justify-end mt-2">
                    <button
                      type="submit"
                      disabled={!commentText.trim() || submittingComment}
                      className="flex items-center gap-2 px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] disabled:opacity-50 transition-colors"
                    >
                      <Send className="w-4 h-4" />
                      {submittingComment ? 'Posting...' : 'Post'}
                    </button>
                  </div>
                </div>
              </div>
            </form>
          ) : (
            <div className="mb-6 p-4 bg-gray-50 rounded-lg text-center">
              <Link href="/login" className="text-[var(--leica-orange)] hover:underline">
                Login
              </Link>{' '}
              to write a comment
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-4">
            {comments.length === 0 ? (
              <p className="text-center text-gray-500 py-8">No comments yet</p>
            ) : (
              comments.map((comment) => (
                <div key={comment.id} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium text-gray-900 text-sm">
                          {comment.authorName}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-400">
                            {formatDate(comment.createdAt)}
                          </span>
                          {user?.id === comment.authorId && (
                            <button
                              onClick={() => handleDeleteComment(comment.id)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                      <p className="text-gray-700 text-sm whitespace-pre-line">
                        {comment.content}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </main>

      {/* Edit Modal */}
      {showEditModal && post && (
        <PostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onSuccess={handlePostUpdated}
        />
      )}
    </div>
  );
}
