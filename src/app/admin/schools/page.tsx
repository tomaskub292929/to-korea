'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal, Plus, Star, CheckCircle, XCircle, Edit, Trash2, Eye } from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';
import { mockSchools } from '@/data/schools';

interface SchoolRow {
  id: string;
  name: string;
  city: string;
  rating: number;
  studentCount: number;
  programs: string[];
  jobOpportunityLevel: string;
  isVerified: boolean;
  isActive: boolean;
}

// Transform mock data
const schoolsData: SchoolRow[] = mockSchools.map((school) => ({
  id: school.id,
  name: school.name,
  city: school.city,
  rating: school.rating,
  studentCount: school.studentCount,
  programs: school.programs,
  jobOpportunityLevel: school.jobOpportunityLevel,
  isVerified: true, // Mock data
  isActive: true, // Mock data
}));

export default function SchoolsPage() {
  const columns = useMemo<ColumnDef<SchoolRow>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => (
          <span className="font-mono text-xs text-gray-500">#{row.original.id}</span>
        ),
      },
      {
        accessorKey: 'name',
        header: 'School Name',
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-sm font-semibold text-gray-600">
                {row.original.name.charAt(0)}
              </span>
            </div>
            <div>
              <p className="font-medium text-gray-900">{row.original.name}</p>
              <p className="text-xs text-gray-500">{row.original.city}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'rating',
        header: 'Rating',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
            <span className="font-medium">{row.original.rating}</span>
          </div>
        ),
      },
      {
        accessorKey: 'studentCount',
        header: 'Students',
        cell: ({ row }) => (
          <span>{row.original.studentCount.toLocaleString()}</span>
        ),
      },
      {
        accessorKey: 'programs',
        header: 'Programs',
        cell: ({ row }) => (
          <div className="flex flex-wrap gap-1 max-w-[200px]">
            {row.original.programs.slice(0, 2).map((program) => (
              <span
                key={program}
                className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded"
              >
                {program}
              </span>
            ))}
            {row.original.programs.length > 2 && (
              <span className="px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">
                +{row.original.programs.length - 2}
              </span>
            )}
          </div>
        ),
        enableSorting: false,
      },
      {
        accessorKey: 'jobOpportunityLevel',
        header: 'Job Opp.',
        cell: ({ row }) => {
          const level = row.original.jobOpportunityLevel;
          const styles = {
            high: 'bg-green-100 text-green-700',
            medium: 'bg-amber-100 text-amber-700',
            low: 'bg-red-100 text-red-700',
          };
          return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[level as keyof typeof styles]}`}>
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </span>
          );
        },
      },
      {
        accessorKey: 'isVerified',
        header: 'Verified',
        cell: ({ row }) => (
          row.original.isVerified ? (
            <CheckCircle className="w-5 h-5 text-green-500" />
          ) : (
            <XCircle className="w-5 h-5 text-gray-300" />
          )
        ),
      },
      {
        accessorKey: 'isActive',
        header: 'Status',
        cell: ({ row }) => (
          <span
            className={`px-2 py-1 text-xs font-medium rounded-full ${
              row.original.isActive
                ? 'bg-green-100 text-green-700'
                : 'bg-gray-100 text-gray-600'
            }`}
          >
            {row.original.isActive ? 'Active' : 'Inactive'}
          </span>
        ),
      },
      {
        id: 'actions',
        header: 'Actions',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/schools/${row.original.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="View Public Page"
              target="_blank"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Link>
            <Link
              href={`/admin/schools/${row.original.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Edit"
            >
              <Edit className="w-4 h-4 text-gray-500" />
            </Link>
            <button className="p-2 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    []
  );

  return (
    <AdminLayout title="Schools" subtitle="Manage all registered schools">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Verification</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[var(--leica-orange)]">
            <option value="">All Cities</option>
            <option value="seoul">Seoul</option>
            <option value="daejeon">Daejeon</option>
            <option value="pohang">Pohang</option>
            <option value="incheon">Incheon</option>
          </select>
        </div>
        <Link
          href="/admin/schools/new"
          className="flex items-center gap-2 h-10 px-4 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add School
        </Link>
      </div>

      {/* Data Table */}
      <DataTable
        data={schoolsData}
        columns={columns}
        searchPlaceholder="Search schools..."
      />
    </AdminLayout>
  );
}
