'use client';

import { useEffect, useMemo, useState } from 'react';
import { ColumnDef } from '@tanstack/react-table';
import Link from 'next/link';
import {
  Eye,
  Trash2,
  Phone,
  User,
  FileText,
  AlertCircle,
  Users,
  Copy,
  Check,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { DataTable } from '@/components/admin/tables/DataTable';
import { subscribeToStudents, deleteStudent } from '@/lib/services/studentService';
import type { StudentRecord } from '@/lib/types/student';

export default function StudentsPage() {
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isLive, setIsLive] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Real-time subscription
  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToStudents((data) => {
      setStudents(data);
      setLoading(false);
      setIsLive(true);
      setError('');
    });

    return () => {
      unsubscribe();
      setIsLive(false);
    };
  }, []);

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`"${name}" 학생의 정보를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteStudent(id);
    } catch (err) {
      console.error('Error deleting student:', err);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  const copyPhone = (phone: string) => {
    navigator.clipboard.writeText(phone);
    setCopiedId(phone);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const columns = useMemo<ColumnDef<StudentRecord>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '이름',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[var(--md-primary)] bg-opacity-10 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-[var(--md-primary)]" />
            </div>
            <span className="font-medium text-gray-900">{row.original.name}</span>
          </div>
        ),
      },
      {
        accessorKey: 'phone',
        header: '연락처',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-gray-400" />
            <span className="text-gray-700">{row.original.phone}</span>
            <button
              onClick={() => copyPhone(row.original.phone)}
              className="p-1 hover:bg-gray-100 rounded transition-colors"
              title="전화번호 복사"
            >
              {copiedId === row.original.phone ? (
                <Check className="w-3 h-3 text-green-500" />
              ) : (
                <Copy className="w-3 h-3 text-gray-400" />
              )}
            </button>
          </div>
        ),
      },
      {
        accessorKey: 'content',
        header: '신청 사유',
        cell: ({ row }) => (
          <div className="max-w-xs">
            <p className="text-gray-700 truncate" title={row.original.content}>
              {row.original.content}
            </p>
          </div>
        ),
      },
      {
        accessorKey: 'createdAt',
        header: '등록일',
        cell: ({ row }) => {
          const date = row.original.createdAt;
          if (!date) return <span className="text-gray-400">-</span>;
          const dateObj = typeof date === 'object' && 'toDate' in date
            ? date.toDate()
            : new Date(date as unknown as string);
          return (
            <span className="text-gray-600 text-sm">
              {dateObj.toLocaleDateString('ko-KR', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          );
        },
      },
      {
        id: 'actions',
        header: '관리',
        cell: ({ row }) => (
          <div className="flex items-center gap-1">
            <Link
              href={`/admin/students/${row.original.id}`}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="상세 보기"
            >
              <Eye className="w-4 h-4 text-gray-500" />
            </Link>
            <button
              onClick={() => handleDelete(row.original.id, row.original.name)}
              className="p-2 hover:bg-red-50 rounded-lg transition-colors"
              title="삭제"
            >
              <Trash2 className="w-4 h-4 text-red-500" />
            </button>
          </div>
        ),
        enableSorting: false,
      },
    ],
    [copiedId]
  );

  if (loading) {
    return (
      <AdminLayout title="학생 관리" subtitle="등록된 학생 정보를 관리합니다">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">학생 목록을 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout title="학생 관리" subtitle="등록된 학생 정보를 관리합니다">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--md-primary)] text-white rounded-lg hover:opacity-90"
            >
              다시 시도
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title="학생 관리" subtitle="등록된 학생 정보를 관리합니다">
      {/* Stats Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{students.length}</p>
              <p className="text-sm text-gray-500">전체 학생</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {students.filter(s => {
                  const date = s.createdAt;
                  if (!date) return false;
                  const d = typeof date === 'object' && 'toDate' in date ? date.toDate() : new Date(date as unknown as string);
                  const today = new Date();
                  return d.toDateString() === today.toDateString();
                }).length}
              </p>
              <p className="text-sm text-gray-500">오늘 등록</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border border-gray-200">
          <div className="flex items-center justify-between">
            {isLive && (
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-sm text-green-700 font-medium">실시간 동기화</span>
              </div>
            )}
            <Link
              href="/student-form"
              target="_blank"
              className="text-sm text-[var(--md-primary)] hover:underline"
            >
              입력 폼 링크 →
            </Link>
          </div>
        </div>
      </div>

      {/* Data Table */}
      {students.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 mb-2">등록된 학생이 없습니다</p>
          <p className="text-sm text-gray-400">
            학생들이 정보를 등록하면 여기에 표시됩니다
          </p>
          <Link
            href="/student-form"
            target="_blank"
            className="inline-block mt-4 px-4 py-2 bg-[var(--md-primary)] text-white rounded-lg hover:opacity-90"
          >
            입력 폼 확인하기
          </Link>
        </div>
      ) : (
        <DataTable
          data={students}
          columns={columns}
          searchPlaceholder="이름 또는 연락처로 검색..."
        />
      )}
    </AdminLayout>
  );
}
