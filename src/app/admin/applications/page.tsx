'use client';

import { useMemo, useState } from 'react';
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
  Filter,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';

interface ApplicationRow {
  id: string;
  applicantName: string;
  applicantEmail: string;
  school: string;
  program: string;
  submittedAt: string;
  status: 'pending' | 'under_review' | 'accepted' | 'rejected' | 'documents_requested';
  priority: 'high' | 'medium' | 'low';
}

const applicationsData: ApplicationRow[] = [
  {
    id: 'A001',
    applicantName: 'Anna Mueller',
    applicantEmail: 'anna.mueller@gmail.com',
    school: 'Seoul National University',
    program: 'Computer Science',
    submittedAt: '2026-02-01',
    status: 'under_review',
    priority: 'high',
  },
  {
    id: 'A002',
    applicantName: 'Mikhail Petrov',
    applicantEmail: 'm.petrov@yandex.ru',
    school: 'Korea University',
    program: 'Business Administration',
    submittedAt: '2026-02-02',
    status: 'pending',
    priority: 'medium',
  },
  {
    id: 'A003',
    applicantName: 'Sophie Dubois',
    applicantEmail: 'sophie.d@outlook.com',
    school: 'Yonsei University',
    program: 'Medicine',
    submittedAt: '2026-02-03',
    status: 'documents_requested',
    priority: 'high',
  },
  {
    id: 'A004',
    applicantName: 'Max Weber',
    applicantEmail: 'max.weber@gmail.com',
    school: 'KAIST',
    program: 'AI & Robotics',
    submittedAt: '2026-01-28',
    status: 'accepted',
    priority: 'low',
  },
  {
    id: 'A005',
    applicantName: 'Olga Ivanova',
    applicantEmail: 'olga.i@mail.ru',
    school: 'POSTECH',
    program: 'Materials Science',
    submittedAt: '2026-01-25',
    status: 'rejected',
    priority: 'low',
  },
  {
    id: 'A006',
    applicantName: 'Pierre Martin',
    applicantEmail: 'pierre.m@free.fr',
    school: 'Sungkyunkwan University',
    program: 'Engineering',
    submittedAt: '2026-02-05',
    status: 'pending',
    priority: 'medium',
  },
];

const statusConfig = {
  pending: { label: 'Pending', icon: Clock, bg: 'bg-gray-100', text: 'text-gray-700' },
  under_review: { label: 'Under Review', icon: Eye, bg: 'bg-blue-100', text: 'text-blue-700' },
  accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-green-100', text: 'text-green-700' },
  rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
  documents_requested: { label: 'Docs Requested', icon: FileText, bg: 'bg-amber-100', text: 'text-amber-700' },
};

const priorityConfig = {
  high: 'bg-red-500',
  medium: 'bg-amber-500',
  low: 'bg-gray-300',
};

export default function ApplicationsPage() {
  const columns = useMemo<ColumnDef<ApplicationRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${priorityConfig[row.original.priority]}`} />
            <span className="font-mono text-xs text-gray-500">{row.original.id}</span>
          </div>
        ),
      },
      {
        accessorKey: 'applicantName',
        header: 'Applicant',
        cell: ({ row }) => (
          <div>
            <p className="font-medium text-gray-900">{row.original.applicantName}</p>
            <p className="text-xs text-gray-500">{row.original.applicantEmail}</p>
          </div>
        ),
      },
      {
        accessorKey: 'school',
        header: 'School',
        cell: ({ row }) => (
          <div>
            <p className="text-gray-900">{row.original.school}</p>
            <p className="text-xs text-gray-500">{row.original.program}</p>
          </div>
        ),
      },
      {
        accessorKey: 'submittedAt',
        header: 'Submitted',
        cell: ({ row }) => (
          <span className="text-gray-600">
            {new Date(row.original.submittedAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
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
            <Link
              href={`/admin/applications/${row.original.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Link>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send Email">
              <Mail className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-green-50 rounded-lg transition-colors" title="Accept">
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

  return (
    <AdminLayout title="Applications" subtitle="Manage student applications">
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        {Object.entries(statusConfig).map(([key, config]) => {
          const count = applicationsData.filter(a => a.status === key).length;
          const Icon = config.icon;
          return (
            <div key={key} className={`p-4 rounded-lg ${config.bg}`}>
              <div className="flex items-center gap-2">
                <Icon className={`w-5 h-5 ${config.text}`} />
                <span className={`text-2xl font-bold ${config.text}`}>{count}</span>
              </div>
              <p className={`text-sm ${config.text} opacity-80`}>{config.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="under_review">Under Review</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
            <option value="">All Schools</option>
            <option value="snu">Seoul National University</option>
            <option value="korea">Korea University</option>
            <option value="yonsei">Yonsei University</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
            <option value="">All Priority</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
          <Download className="w-4 h-4" />
          Export
        </button>
      </div>

      <DataTable
        data={applicationsData}
        columns={columns}
        searchPlaceholder="Search applications..."
      />
    </AdminLayout>
  );
}
