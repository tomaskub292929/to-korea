'use client';

import { useState, useEffect } from 'react';
import { Star, ThumbsUp, User, Edit, Trash2, MessageSquare } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import {
  getReviewsBySchoolId,
  createReview,
  deleteReview,
  markReviewHelpful,
  updateReview,
} from '@/lib/services/reviewService';
import type { SchoolReview, ReviewFormData } from '@/lib/types/review';
import Link from 'next/link';

interface SchoolReviewsProps {
  schoolId: string;
  schoolName: string;
}

export function SchoolReviews({ schoolId, schoolName }: SchoolReviewsProps) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<SchoolReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingReview, setEditingReview] = useState<SchoolReview | null>(null);

  // Form state
  const [formData, setFormData] = useState<ReviewFormData>({
    rating: 5,
    title: '',
    content: '',
    pros: '',
    cons: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchReviews = async () => {
    try {
      const data = await getReviewsBySchoolId(schoolId);
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [schoolId]);

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'object' && 'toDate' in date
      ? date.toDate()
      : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setSubmitting(true);
    try {
      if (editingReview) {
        await updateReview(editingReview.id, formData);
      } else {
        const displayName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous';
        await createReview(
          schoolId,
          formData,
          user.id,
          displayName,
          user.email || ''
        );
      }
      setFormData({ rating: 5, title: '', content: '', pros: '', cons: '' });
      setShowForm(false);
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      console.error('Error saving review:', error);
      alert('Failed to save review');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (review: SchoolReview) => {
    setEditingReview(review);
    setFormData({
      rating: review.rating,
      title: review.title,
      content: review.content,
      pros: review.pros || '',
      cons: review.cons || '',
    });
    setShowForm(true);
  };

  const handleDelete = async (reviewId: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      await deleteReview(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Error deleting review:', error);
    }
  };

  const handleHelpful = async (reviewId: string) => {
    try {
      await markReviewHelpful(reviewId);
      fetchReviews();
    } catch (error) {
      console.error('Error marking helpful:', error);
    }
  };

  const averageRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '0';

  const StarRating = ({ rating, onChange, readonly = false }: { rating: number; onChange?: (r: number) => void; readonly?: boolean }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readonly && onChange?.(star)}
          disabled={readonly}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'} transition-transform`}
        >
          <Star
            className={`w-5 h-5 ${star <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-300'}`}
          />
        </button>
      ))}
    </div>
  );

  return (
    <section className="bg-white rounded-xl p-6 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--deep-navy)] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[var(--leica-orange)]" />
            Reviews & Comments
          </h2>
          <div className="flex items-center gap-3 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
              <span className="font-semibold text-lg">{averageRating}</span>
            </div>
            <span className="text-gray-500">({reviews.length} reviews)</span>
          </div>
        </div>
        {user && !showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] transition-colors"
          >
            Write a Review
          </button>
        )}
      </div>

      {/* Review Form */}
      {showForm && user && (
        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">
            {editingReview ? 'Edit Your Review' : `Review ${schoolName}`}
          </h3>

          {/* Rating */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Rating</label>
            <StarRating
              rating={formData.rating}
              onChange={(r) => setFormData({ ...formData, rating: r })}
            />
          </div>

          {/* Title */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Summarize your experience"
              className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
              required
            />
          </div>

          {/* Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Your Review</label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your experience at this school..."
              rows={4}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)] resize-none"
              required
            />
          </div>

          {/* Pros & Cons */}
          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-green-600 mb-2">👍 Pros</label>
              <textarea
                value={formData.pros}
                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                placeholder="What did you like?"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-red-600 mb-2">👎 Cons</label>
              <textarea
                value={formData.cons}
                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                placeholder="What could be improved?"
                rows={2}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-red-500 resize-none"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingReview(null);
                setFormData({ rating: 5, title: '', content: '', pros: '', cons: '' });
              }}
              className="px-4 py-2 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : editingReview ? 'Update Review' : 'Post Review'}
            </button>
          </div>
        </form>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-600">
            <Link href="/login" className="text-[var(--leica-orange)] hover:underline font-medium">
              Login
            </Link>{' '}
            to write a review
          </p>
        </div>
      )}

      {/* Reviews List */}
      {loading ? (
        <div className="text-center py-8">
          <div className="w-6 h-6 border-2 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
          <p>No reviews yet. Be the first to share your experience!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <div key={review.id} className="border border-gray-200 rounded-lg p-4">
              {/* Review Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{review.authorName}</p>
                    <div className="flex items-center gap-2">
                      <StarRating rating={review.rating} readonly />
                      <span className="text-xs text-gray-500">{formatDate(review.createdAt)}</span>
                    </div>
                  </div>
                </div>
                {user?.id === review.authorId && (
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleEdit(review)}
                      className="p-1.5 text-gray-400 hover:text-[var(--leica-orange)] hover:bg-gray-100 rounded transition-colors"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(review.id)}
                      className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* Review Title */}
              <h4 className="font-semibold text-gray-900 mb-2">{review.title}</h4>

              {/* Review Content */}
              <p className="text-gray-700 mb-3 whitespace-pre-line">{review.content}</p>

              {/* Pros & Cons */}
              {(review.pros || review.cons) && (
                <div className="grid md:grid-cols-2 gap-3 mb-3">
                  {review.pros && (
                    <div className="bg-green-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-green-700 mb-1">👍 Pros</p>
                      <p className="text-sm text-green-800">{review.pros}</p>
                    </div>
                  )}
                  {review.cons && (
                    <div className="bg-red-50 rounded-lg p-3">
                      <p className="text-sm font-medium text-red-700 mb-1">👎 Cons</p>
                      <p className="text-sm text-red-800">{review.cons}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Helpful Button */}
              <button
                onClick={() => handleHelpful(review.id)}
                className="flex items-center gap-1 text-sm text-gray-500 hover:text-[var(--leica-orange)] transition-colors"
              >
                <ThumbsUp className="w-4 h-4" />
                Helpful ({review.helpfulCount})
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
