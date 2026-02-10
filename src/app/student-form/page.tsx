'use client';

import { useState } from 'react';
import Link from 'next/link';
import { CheckCircle, AlertCircle, Loader2, User, Phone, FileText } from 'lucide-react';
import { createStudentRecord } from '@/lib/services/studentService';
import { validateStudentForm, type StudentFormData } from '@/lib/types/student';

export default function StudentFormPage() {
  const [formData, setFormData] = useState<StudentFormData>({
    name: '',
    phone: '',
    content: '',
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear errors when user starts typing
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    const validation = validateStudentForm(formData);
    if (!validation.valid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    setErrors([]);

    try {
      await createStudentRecord(formData);
      setIsSubmitted(true);
    } catch (error) {
      console.error('Submission error:', error);
      setErrors(['제출 중 오류가 발생했습니다. 다시 시도해주세요.']);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            제출 완료
          </h1>
          <p className="text-gray-600 mb-6">
            학생 정보가 성공적으로 등록되었습니다.<br />
            담당자가 검토 후 연락드리겠습니다.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => {
                setIsSubmitted(false);
                setFormData({ name: '', phone: '', content: '' });
              }}
              className="w-full py-3 bg-[var(--md-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity"
            >
              새로운 정보 등록
            </button>
            <Link
              href="/"
              className="block w-full py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
            >
              홈으로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-2xl mx-auto px-4 py-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              학생 정보 등록
            </h1>
            <p className="text-gray-600">
              아래 양식을 작성하여 정보를 제출해주세요.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-2xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 md:p-8">
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
            {/* Name Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <User className="w-4 h-4" />
                이름 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Phone Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <Phone className="w-4 h-4" />
                연락처 <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="010-1234-5678"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent transition-all"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                연락 가능한 전화번호를 입력해주세요.
              </p>
            </div>

            {/* Content Field */}
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                <FileText className="w-4 h-4" />
                신청 사유 <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                rows={5}
                placeholder="신청 사유나 문의 내용을 자세히 작성해주세요."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-[var(--md-primary)] focus:border-transparent transition-all resize-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.content.length}자 / 최소 10자
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-8">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[var(--md-primary)] text-white rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  제출 중...
                </>
              ) : (
                '정보 제출하기'
              )}
            </button>
          </div>

          {/* Privacy Notice */}
          <p className="text-xs text-gray-500 text-center mt-4">
            제출하신 정보는 서비스 제공 목적으로만 사용되며,<br />
            <Link href="/privacy" className="text-[var(--md-primary)] hover:underline">
              개인정보처리방침
            </Link>
            에 따라 안전하게 관리됩니다.
          </p>
        </form>
      </div>
    </div>
  );
}
