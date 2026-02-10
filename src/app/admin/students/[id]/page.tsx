'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Save,
  Trash2,
  Loader2,
  User,
  Phone,
  FileText,
  Calendar,
  AlertCircle,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import {
  subscribeToStudent,
  updateStudent,
  deleteStudent,
} from '@/lib/services/studentService';
import { validateStudentForm, type StudentRecord, type StudentFormData } from '@/lib/types/student';

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const studentId = params.id as string;

  const [student, setStudent] = useState<StudentRecord | null>(null);
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    phone: '',
    content: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [hasChanges, setHasChanges] = useState(false);

  // Real-time subscription
  useEffect(() => {
    const unsubscribe = subscribeToStudent(studentId, (data) => {
      setStudent(data);
      if (data) {
        setFormData({
          name: data.name,
          phone: data.phone,
          content: data.content,
        });
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [studentId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setHasChanges(true);
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSave = async () => {
    const validation = validateStudentForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setSaving(true);
    setErrors([]);

    try {
      await updateStudent(studentId, formData);
      setHasChanges(false);
      alert('저장되었습니다.');
    } catch (error) {
      console.error('Save error:', error);
      setErrors(['저장에 실패했습니다. 다시 시도해주세요.']);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!student) return;

    if (!confirm(`"${student.name}" 학생의 정보를 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
      return;
    }

    try {
      await deleteStudent(studentId);
      router.push('/admin/students');
    } catch (error) {
      console.error('Delete error:', error);
      alert('삭제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (loading) {
    return (
      <AdminLayout title="학생 정보" subtitle="학생 상세 정보를 확인합니다">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500">정보를 불러오는 중...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (!student) {
    return (
      <AdminLayout title="학생 정보" subtitle="학생 상세 정보를 확인합니다">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">학생 정보를 찾을 수 없습니다.</p>
            <Link
              href="/admin/students"
              className="px-4 py-2 bg-[var(--md-primary)] text-white rounded-lg hover:opacity-90"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const createdAt = student.createdAt;
  const createdDate = createdAt
    ? typeof createdAt === 'object' && 'toDate' in createdAt
      ? createdAt.toDate()
      : new Date(createdAt as unknown as string)
    : null;

  return (
    <AdminLayout title="학생 정보" subtitle="학생 상세 정보를 확인하고 수정합니다">
      {/* Header Actions */}
      <div className="flex items-center justify-between mb-6">
        <Link
          href="/admin/students"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          목록으로
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            삭제
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !hasChanges}
            className="flex items-center gap-2 px-4 py-2 bg-[var(--md-primary)] text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            저장
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold mb-6">학생 정보 수정</h2>

            {/* Error Messages */}
            {errors.length > 0 && (
              <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-red-800 mb-1">입력 오류</p>
                    <ul className="text-sm text-red-600 space-y-1">
                      {errors.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="w-4 h-4" />
                  이름
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <Phone className="w-4 h-4" />
                  연락처
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent"
                />
              </div>

              {/* Content */}
              <div>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                  <FileText className="w-4 h-4" />
                  신청 사유
                </label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent resize-none"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.content.length}자
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-sm font-semibold text-gray-500 uppercase mb-4">
              등록 정보
            </h3>

            <div className="space-y-4">
              <div>
                <p className="text-xs text-gray-500 mb-1">ID</p>
                <p className="text-sm font-mono text-gray-700 break-all">{student.id}</p>
              </div>

              <div>
                <p className="text-xs text-gray-500 mb-1">등록일</p>
                <div className="flex items-center gap-2 text-sm text-gray-700">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  {createdDate
                    ? createdDate.toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })
                    : '-'}
                </div>
              </div>

              {hasChanges && (
                <div className="pt-4 border-t">
                  <p className="text-xs text-amber-600 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    저장되지 않은 변경사항이 있습니다
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
