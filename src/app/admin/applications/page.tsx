'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import {
  Eye,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Download,
  AlertCircle,
  DollarSign,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';
import { subscribeToApplications, updateApplicationStatus } from '@/lib/services/applicationService';
import type { Application, ApplicationStatus } from '@/lib/types/application';

const statusConfig: Record<ApplicationStatus, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  draft: { label: 'Draft', icon: FileText, bg: 'bg-gray-100', text: 'text-gray-700' },
  submitted: { label: 'Submitted', icon: Clock, bg: 'bg-blue-100', text: 'text-blue-700' },
  paid: { label: 'Paid', icon: DollarSign, bg: 'bg-green-100', text: 'text-green-700' },
  under_review: { label: 'Under Review', icon: Eye, bg: 'bg-amber-100', text: 'text-amber-700' },
  accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isLive, setIsLive] = useState(false);

  // Real-time subscription to applications
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToApplications((data) => {
      setApplications(data);
      setLoading(false);
      setIsLive(true);
      setError('');
    });

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
      setIsLive(false);
    };
  }, []);

  const handleStatusChange = async (applicationId: string, newStatus: ApplicationStatus) => {
    try {
      await updateApplicationStatus(applicationId, newStatus);
      // No need to manually refresh - real-time subscription will update automatically
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    }
  };

  const filteredApplications = useMemo(() => {
    if (!statusFilter) return applications;
    return applications.filter(app => app.status === statusFilter);
  }, [applications, statusFilter]);

  const columns = useMemo<ColumnDef<Application>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-500">
            {row.original.id.slice(0, 8)}...
          </span>
        ),
      },
      {
        accessorKey: 'applicantName',
        header: 'Applicant',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">
              {row.original.firstName && row.original.lastName
                ? `${row.original.firstName} ${row.original.lastName}`
                : 'Not filled'}
            </p>
            <p className="text-xs text-gray-500">{row.original.email || 'No email'}</p>
          </div>
        ),
      },
      {
        accessorKey: 'schoolName',
        header: 'School',
        cell: ({ row }) => (
          <div>
            <p className="text-gray-900">{row.original.schoolName}</p>
            <p className="text-xs text-gray-500">{row.original.intendedProgram || 'No program selected'}</p>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: 'Date',
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return <span className="text-gray-400">-</span>;
          const dateObj = typeof date === 'object' && 'toDate' in date
            ? date.toDate()
            : new Date(date as unknown as string);
          return (
            <span className="text-gray-600 text-sm">
              {dateObj.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
              })}
            </span>
          );
        },
      },
      {
        accessorKey: 'paymentAmount',
        header: 'Payment',
        cell: ({ row }) => (
          <span className={`font-medium ${row.original.paymentAmount ? 'text-green-600' : 'text-gray-400'}`}>
            {row.original.paymentAmount ? `$${row.original.paymentAmount}` : '-'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const config = statusConfig[row.original.status] || statusConfig.draft;
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
            <Link
              href={`/admin/applications/${row.original.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Link>
            <button
              onClick={() => handleStatusChange(row.original.id, 'under_review')}
              className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
              title="Mark Under Review"
            >
              <Eye className="w-4 h-4 text-blue-500" />
            </button>
            <button
              onClick={() => handleStatusChange(row.original.id, 'accepted')}
              className="p-2 hover:bg-green-50 rounded-lg transition-colors"
              title="Accept"
            >
              <CheckCircle className="w-4 h-4 text-green-500" />
            </button>
            <button
              onClick={() => handleStatusChange(row.original.id, 'rejected')}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="Reject"
            >
              <XCircle className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  if (loading) {
    return (
      <AdminLayout title="Applications" subtitle="Manage student applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">Loading applications...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="Applications" subtitle="Manage student applications">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--md-primary)] text-white rounded-lg hover:opacity-90"
            >
              Try Again
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="Applications" subtitle="Manage student applications">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = applications.filter(a => a.status === key).length;
          const Icon = config.icon;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? '' : key)}
              className={`p-4 rounded-lg transition-all ${config.bg} ${statusFilter === key ? 'ring-2 ring-offset-2 ring-gray-400' : ''}`}
            >
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${config.text}`} />
                <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
              </div>
              <p className={`text-sm ${config.text} opacity-80`}>{config.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm"
          >
            <option value="">All Status ({applications.length})</option>
            {Object.entries(statusConfig).map(([key, config]) => (
              <option key={key} value={key}>
                {config.label} ({applications.filter(a => a.status === key).length})
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-2">
          {isLive && (
            <div className="flex items-center gap-2 h-10 px-4 bg-green-50 border border-green-200 rounded-lg">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm text-green-700 font-medium">Live</span>
            </div>
          )}
          <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">No applications found</p>
          <p className="text-sm text-gray-400">
            {statusFilter ? 'Try changing the filter' : 'Applications will appear here when students apply'}
          </p>
        </div>
      ) : (
        <DataTable
          data={filteredApplications}
          columns={columns}
          searchPlaceholder="Search applications..."
        />
      )}
    </AdminLayout>
  );
}
