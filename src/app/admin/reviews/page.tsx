'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  Star,
  CheckCircle,
  XCircle,
  Clock,
  Flag,
  Eye,
  MessageSquare,
  X,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';

interface ReviewRow {
  id: string;
  author: string;
  authorEmail: string;
  school: string;
  rating: number;
  content: string;
  createdAt: string;
  status: 'pending' | 'approved' | 'rejected' | 'flagged';
  reports: number;
}

const reviewsData: ReviewRow[] = [
  {
    id: 'R001',
    author: 'Anna Mueller',
    authorEmail: 'anna.mueller@gmail.com',
    school: 'Seoul National University',
    rating: 5,
    content: 'The faculty at SNU is exceptional. Professors are always available for consultation and the research facilities are world-class. Highly recommended for anyone interested in engineering.',
    createdAt: '2026-02-01',
    status: 'pending',
    reports: 0,
  },
  {
    id: 'R002',
    author: 'Mikhail Petrov',
    authorEmail: 'm.petrov@yandex.ru',
    school: 'Korea University',
    rating: 4,
    content: 'Great university with excellent career support. The international office is very helpful with visa and housing issues.',
    createdAt: '2026-02-02',
    status: 'approved',
    reports: 0,
  },
  {
    id: 'R003',
    author: 'Anonymous',
    authorEmail: 'anon@temp.com',
    school: 'Yonsei University',
    rating: 1,
    content: 'This is spam content that should be rejected...',
    createdAt: '2026-02-03',
    status: 'flagged',
    reports: 3,
  },
  {
    id: 'R004',
    author: 'Sophie Dubois',
    authorEmail: 'sophie.d@outlook.com',
    school: 'KAIST',
    rating: 5,
    content: 'Perfect for tech enthusiasts! The campus is modern and the research opportunities are amazing.',
    createdAt: '2026-02-04',
    status: 'pending',
    reports: 0,
  },
  {
    id: 'R005',
    author: 'Max Weber',
    authorEmail: 'max.weber@gmail.com',
    school: 'POSTECH',
    rating: 4,
    content: 'Small but excellent institution. Very focused on research and innovation.',
    createdAt: '2026-02-05',
    status: 'approved',
    reports: 0,
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-100', text: 'text-amber-700' },
  approved: { label: 'Approved', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
  flagged: { label: 'Flagged', icon: Flag, bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ReviewsPage() {
  const [selectedReview, setSelectedReview] = useState<ReviewRow | null>(null);

  const columns = useMemo<ColumnDef<ReviewRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-500">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.author}</p>
            <p className="text-xs text-gray-500">{row.original.authorEmail}</p>
          </div>
        ),
      },
      {
        accessorKey: 'school',
        header: 'School',
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < row.original.rating
                    ? 'text-amber-500 fill-amber-500'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
        ),
      },
      {
        accessorKey: 'content',
        header: 'Preview',
        cell: ({ row }) => (
          <p className="text-sm text-gray-600 truncate max-w-[200px]">
            {row.original.content}
          </p>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'reports',
        header: 'Reports',
        cell: ({ row }) => (
          row.original.reports > 0 ? (
            <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
              {row.original.reports} reports
            </span>
          ) : (
            <span className="text-gray-400">-</span>
          )
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const config = statusConfig[row.original.status];
          const Icon = config.icon;
          return (
            <span className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full ${config.bg} ${config.text}`}>
              <Icon className="w-3 h-3" />
              {config.label}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <button
              onClick={() => setSelectedReview(row.original)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Approve">
              <CheckCircle className="w-4 h-4 text-green-500" />
            </button>
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
              <XCircle className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  const pendingCount = reviewsData.filter(r => r.status === 'pending').length;
  const flaggedCount = reviewsData.filter(r => r.status === 'flagged').length;

  return (
    <AdminLayout title="Reviews" subtitle="Moderate user reviews">
      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="p-4 bg-amber-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-700" />
            <span className="text-2xl font-bold text-amber-700">{pendingCount}</span>
          </div>
          <p className="text-sm text-amber-700">Pending Review</p>
        </div>
        <div className="p-4 bg-red-100 rounded-lg">
          <div className="flex items-center gap-2">
            <Flag className="w-5 h-5 text-red-700" />
            <span className="text-2xl font-bold text-red-700">{flaggedCount}</span>
          </div>
          <p className="text-sm text-red-700">Flagged</p>
        </div>
        <div className="p-4 bg-green-100 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-700" />
            <span className="text-2xl font-bold text-green-700">
              {reviewsData.filter(r => r.status === 'approved').length}
            </span>
          </div>
          <p className="text-sm text-green-700">Approved</p>
        </div>
        <div className="p-4 bg-gray-100 rounded-lg">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-gray-700" />
            <span className="text-2xl font-bold text-gray-700">{reviewsData.length}</span>
          </div>
          <p className="text-sm text-gray-700">Total Reviews</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="flagged">Flagged</option>
        </select>
        <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
          <option value="">All Ratings</option>
          <option value="5">5 Stars</option>
          <option value="4">4 Stars</option>
          <option value="3">3 Stars</option>
          <option value="2">2 Stars</option>
          <option value="1">1 Star</option>
        </select>
      </div>

      <DataTable
        data={reviewsData}
        columns={columns}
        searchPlaceholder="Search reviews..."
      />

      {/* Review Modal */}
      {selectedReview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b">
              <h3 className="text-lg font-semibold">Review Moderation</h3>
              <button onClick={() => setSelectedReview(null)} className="p-2 hover:bg-gray-100 rounded-lg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* Review Info */}
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-medium text-gray-900">{selectedReview.author}</p>
                  <p className="text-sm text-gray-500">{selectedReview.authorEmail}</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < selectedReview.rating
                          ? 'text-amber-500 fill-amber-500'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">School</p>
                <p className="font-medium">{selectedReview.school}</p>
              </div>

              <div>
                <p className="text-sm text-gray-500 mb-1">Review Content</p>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-800">{selectedReview.content}</p>
                </div>
              </div>

              {selectedReview.reports > 0 && (
                <div className="p-4 bg-red-50 rounded-lg">
                  <p className="text-red-700 font-medium">⚠️ This review has {selectedReview.reports} reports</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  Approve
                </button>
                <button
                  onClick={() => setSelectedReview(null)}
                  className="flex-1 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center justify-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  Reject
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
