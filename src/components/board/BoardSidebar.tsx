'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Plus, Eye, Heart, Clock } from 'lucide-react';
import { getRecentPosts } from '@/lib/services/boardService';
import { POST_CATEGORIES } from '@/lib/types/board';
import type { Post, PostCategory } from '@/lib/types/board';
import { useAuth } from '@/contexts/AuthContext';
import { PostModal } from './PostModal';

interface BoardSidebarProps {
  onPostCreated?: () => void;
}

export function BoardSidebar({ onPostCreated }: BoardSidebarProps) {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = async () => {
    try {
      const data = await getRecentPosts(5);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const formatDate = (date: any) => {
    if (!date) return '';
    const dateObj = typeof date === 'object' && 'toDate' in date
      ? date.toDate()
      : new Date(date);
    const now = new Date();
    const diff = now.getTime() - dateObj.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(hours / 24);

    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return dateObj.toLocaleDateString();
  };

  const getCategoryEmoji = (category: PostCategory) => {
    const cat = POST_CATEGORIES.find(c => c.value === category);
    return cat?.emoji || '💬';
  };

  const handlePostCreated = () => {
    setShowModal(false);
    fetchPosts();
    onPostCreated?.();
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-[var(--deep-navy)] text-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            <h2 className="font-semibold">Community Board</h2>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="p-1.5 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
              title="Write Post"
            >
              <Plus className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Posts List */}
      <div className="divide-y divide-gray-100">
        {loading ? (
          <div className="p-4 text-center">
            <div className="w-6 h-6 border-2 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-6 text-center">
            <MessageSquare className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-sm text-gray-500">No posts yet</p>
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="mt-2 text-sm text-[var(--leica-orange)] hover:underline"
              >
                Be the first to post!
              </button>
            )}
          </div>
        ) : (
          posts.map((post) => (
            <Link
              key={post.id}
              href={`/board/${post.id}`}
              className="block p-3 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-lg">{getCategoryEmoji(post.category)}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatDate(post.createdAt)}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.viewCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {post.commentCount}
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* View All Link */}
      {posts.length > 0 && (
        <div className="p-3 border-t border-gray-100">
          <Link
            href="/board"
            className="block text-center text-sm text-[var(--leica-orange)] hover:underline"
          >
            View All Posts →
          </Link>
        </div>
      )}

      {/* Login Prompt */}
      {!user && (
        <div className="p-3 bg-gray-50 border-t border-gray-100">
          <p className="text-xs text-gray-500 text-center">
            <Link href="/login" className="text-[var(--leica-orange)] hover:underline">
              Login
            </Link>{' '}
            to write a post
          </p>
        </div>
      )}

      {/* Post Modal */}
      {showModal && (
        <PostModal
          onClose={() => setShowModal(false)}
          onSuccess={handlePostCreated}
        />
      )}
    </div>
  );
}
