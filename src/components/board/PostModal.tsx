'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { createPost, updatePost } from '@/lib/services/boardService';
import { POST_CATEGORIES } from '@/lib/types/board';
import type { Post, PostCategory, PostFormData } from '@/lib/types/board';
import { useAuth } from '@/contexts/AuthContext';

interface PostModalProps {
  post?: Post; // If provided, edit mode
  onClose: () => void;
  onSuccess: () => void;
}

export function PostModal({ post, onClose, onSuccess }: PostModalProps) {
  const { user } = useAuth();
  const isEdit = !!post;

  const [formData, setFormData] = useState<PostFormData>({
    title: post?.title || '',
    content: post?.content || '',
    category: post?.category || 'general',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      setError('Please login to continue');
      return;
    }

    if (!formData.title.trim() || !formData.content.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      if (isEdit && post) {
        await updatePost(post.id, formData);
      } else {
        const displayName = user.firstName && user.lastName
          ? `${user.firstName} ${user.lastName}`
          : 'Anonymous';
        await createPost(
          formData,
          user.id,
          displayName,
          user.email || ''
        );
      }
      onSuccess();
    } catch (err) {
      console.error('Error saving post:', err);
      setError('Failed to save post. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Post' : 'New Post'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
              {error}
            </div>
          )}

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, category: cat.value })}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    formData.category === cat.value
                      ? 'bg-[var(--leica-orange)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Enter your post title"
              maxLength={100}
              className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
              required
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.title.length}/100
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Content <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Share your thoughts, questions, or tips..."
              rows={6}
              maxLength={2000}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)] resize-none"
              required
            />
            <p className="mt-1 text-xs text-gray-500 text-right">
              {formData.content.length}/2000
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 h-10 border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 h-10 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] disabled:opacity-50 transition-colors"
            >
              {submitting ? 'Saving...' : isEdit ? 'Update' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
