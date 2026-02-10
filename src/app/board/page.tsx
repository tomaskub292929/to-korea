'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Plus, Eye, Heart, MessageSquare, Clock, Search } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { getAllPosts } from '@/lib/services/boardService';
import { POST_CATEGORIES } from '@/lib/types/board';
import type { Post, PostCategory } from '@/lib/types/board';
import { useAuth } from '@/contexts/AuthContext';
import { PostModal } from '@/components/board/PostModal';

export default function BoardPage() {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState<PostCategory | ''>('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await getAllPosts(categoryFilter || undefined);
      setPosts(data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [categoryFilter]);

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

  const getCategoryInfo = (category: PostCategory) => {
    return POST_CATEGORIES.find(c => c.value === category) || POST_CATEGORIES[0];
  };

  const filteredPosts = posts.filter(post =>
    searchQuery === '' ||
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePostCreated = () => {
    setShowModal(false);
    fetchPosts();
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/schools"
            className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Schools
          </Link>
        </div>

        {/* Page Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-[var(--deep-navy)]">
              Community Board
            </h1>
            <p className="text-[var(--warm-gray)] mt-1">
              Share tips, ask questions, and connect with others
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Post
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search posts..."
                className="w-full h-10 pl-10 pr-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
              />
            </div>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setCategoryFilter('')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  categoryFilter === ''
                    ? 'bg-[var(--deep-navy)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                All
              </button>
              {POST_CATEGORIES.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    categoryFilter === cat.value
                      ? 'bg-[var(--leica-orange)] text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Posts List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">No posts found</p>
            {user && (
              <button
                onClick={() => setShowModal(true)}
                className="text-[var(--leica-orange)] hover:underline"
              >
                Be the first to post!
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredPosts.map((post) => {
              const catInfo = getCategoryInfo(post.category);
              return (
                <Link
                  key={post.id}
                  href={`/board/${post.id}`}
                  className="block bg-white rounded-xl border border-gray-200 p-5 hover:border-[var(--leica-orange)] transition-colors"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-xl">
                      {catInfo.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600`}>
                          {catInfo.label}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                        {post.title}
                      </h3>
                      <p className="text-sm text-gray-500 line-clamp-2 mb-3">
                        {post.content}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>{post.authorName}</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(post.createdAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          {post.viewCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {post.likeCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3" />
                          {post.commentCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        {/* Login Prompt */}
        {!user && (
          <div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
            <p className="text-gray-600">
              <Link href="/login" className="text-[var(--leica-orange)] hover:underline font-medium">
                Login
              </Link>{' '}
              to write posts and join the conversation
            </p>
          </div>
        )}
      </main>

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
