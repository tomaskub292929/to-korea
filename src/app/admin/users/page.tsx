'use client';

import { useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import {
  MoreHorizontal,
  Download,
  Mail,
  Ban,
  Key,
  Eye,
  FileText,
  Star,
  X
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';

interface UserRow {
  id: string;
  name: string;
  email: string;
  country: string;
  countryCode: string;
  joinDate: string;
  applications: number;
  reviews: number;
  status: 'active' | 'suspended' | 'pending';
  profileComplete: boolean;
}

// Mock users data
const usersData: UserRow[] = [
  {
    id: 'U001',
    name: 'Anna Mueller',
    email: 'anna.mueller@gmail.com',
    country: 'Germany',
    countryCode: 'DE',
    joinDate: '2026-01-15',
    applications: 3,
    reviews: 2,
    status: 'active',
    profileComplete: true,
  },
  {
    id: 'U002',
    name: 'Mikhail Petrov',
    email: 'm.petrov@yandex.ru',
    country: 'Russia',
    countryCode: 'RU',
    joinDate: '2026-01-20',
    applications: 2,
    reviews: 1,
    status: 'active',
    profileComplete: true,
  },
  {
    id: 'U003',
    name: 'Sophie Dubois',
    email: 'sophie.d@outlook.com',
    country: 'France',
    countryCode: 'FR',
    joinDate: '2026-01-22',
    applications: 1,
    reviews: 0,
    status: 'pending',
    profileComplete: false,
  },
  {
    id: 'U004',
    name: 'Max Weber',
    email: 'max.weber@gmail.com',
    country: 'Germany',
    countryCode: 'DE',
    joinDate: '2026-01-25',
    applications: 4,
    reviews: 3,
    status: 'active',
    profileComplete: true,
  },
  {
    id: 'U005',
    name: 'Olga Ivanova',
    email: 'olga.i@mail.ru',
    country: 'Russia',
    countryCode: 'RU',
    joinDate: '2026-01-28',
    applications: 2,
    reviews: 1,
    status: 'active',
    profileComplete: true,
  },
  {
    id: 'U006',
    name: 'Pierre Martin',
    email: 'pierre.m@free.fr',
    country: 'France',
    countryCode: 'FR',
    joinDate: '2026-02-01',
    applications: 0,
    reviews: 0,
    status: 'suspended',
    profileComplete: false,
  },
  {
    id: 'U007',
    name: 'Aisha Nazarbayeva',
    email: 'aisha.n@gmail.com',
    country: 'Kazakhstan',
    countryCode: 'KZ',
    joinDate: '2026-02-03',
    applications: 1,
    reviews: 0,
    status: 'active',
    profileComplete: true,
  },
  {
    id: 'U008',
    name: 'Viktor Shevchenko',
    email: 'v.shevchenko@ukr.net',
    country: 'Ukraine',
    countryCode: 'UA',
    joinDate: '2026-02-05',
    applications: 2,
    reviews: 1,
    status: 'active',
    profileComplete: true,
  },
];

const countryFlags: Record<string, string> = {
  DE: '🇩🇪',
  RU: '🇷🇺',
  FR: '🇫🇷',
  KZ: '🇰🇿',
  UA: '🇺🇦',
};

export default function UsersPage() {
  const [selectedUser, setSelectedUser] = useState<UserRow | null>(null);

  const columns = useMemo<ColumnDef<UserRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-500">{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'User',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-white">
                {row.original.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.original.name}</p>
              <p className="text-xs text-gray-500">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'country',
        header: 'Country',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <span className="text-lg">{countryFlags[row.original.countryCode] || '🌍'}</span>
            <span>{row.original.country}</span>
          </div>
        ),
      },
      {
        accessorKey: 'joinDate',
        header: 'Join Date',
        cell: ({ row }) => (
          <span className="text-gray-600">
            {new Date(row.original.joinDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        ),
      },
      {
        accessorKey: 'applications',
        header: 'Applications',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-gray-400" />
            <span>{row.original.applications}</span>
          </div>
        ),
      },
      {
        accessorKey: 'reviews',
        header: 'Reviews',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-gray-400" />
            <span>{row.original.reviews}</span>
          </div>
        ),
      },
      {
        accessorKey: 'profileComplete',
        header: 'Profile',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              row.original.profileComplete
                ? 'bg-green-100 text-green-700'
                : 'bg-amber-100 text-amber-700'
            }`}
          >
            {row.original.profileComplete ? 'Complete' : 'Incomplete'}
          </span>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const styles = {
            active: 'bg-green-100 text-green-700',
            suspended: 'bg-red-100 text-red-700',
            pending: 'bg-amber-100 text-amber-700',
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[row.original.status]}`}>
              {row.original.status.charAt(0).toUpperCase() + row.original.status.slice(1)}
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
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Details"
              onClick={() => setSelectedUser(row.original)}
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Send Email">
              <Mail className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors" title="Reset Password">
              <Key className="w-4 h-4 text-gray-500" />
            </button>
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Suspend">
              <Ban className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <AdminLayout title="Users" subtitle="Manage platform users">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="suspended">Suspended</option>
            <option value="pending">Pending</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Countries</option>
            <option value="DE">Germany</option>
            <option value="RU">Russia</option>
            <option value="FR">France</option>
            <option value="KZ">Kazakhstan</option>
            <option value="UA">Ukraine</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Profiles</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
        </div>
        <button className="flex items-center gap-2 h-10 px-4 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
          <Download className="w-4 h-4" />
          Export CSV
        </button>
      </div>

      {/* Data Table */}
      <DataTable
        data={usersData}
        columns={columns}
        searchPlaceholder="Search users..."
      />

      {/* User Detail Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">User Details</h3>
              <button
                onClick={() => setSelectedUser(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-6">
              {/* User Info */}
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-xl font-semibold text-white">
                    {selectedUser.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
                <div>
                  <h4 className="text-xl font-semibold text-gray-900">{selectedUser.name}</h4>
                  <p className="text-gray-500">{selectedUser.email}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-lg">{countryFlags[selectedUser.countryCode]}</span>
                    <span className="text-sm text-gray-600">{selectedUser.country}</span>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.applications}</p>
                  <p className="text-sm text-gray-500">Applications</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">{selectedUser.reviews}</p>
                  <p className="text-sm text-gray-500">Reviews</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg text-center">
                  <p className="text-2xl font-bold text-gray-900">
                    {new Date(selectedUser.joinDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                  <p className="text-sm text-gray-500">Joined</p>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Key className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Send Password Reset Link</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                  <Download className="w-5 h-5 text-gray-600" />
                  <span className="text-gray-700">Export User Data (GDPR)</span>
                </button>
                <button className="w-full flex items-center gap-3 p-3 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
                  <Ban className="w-5 h-5 text-red-600" />
                  <span className="text-red-700">Suspend Account</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
