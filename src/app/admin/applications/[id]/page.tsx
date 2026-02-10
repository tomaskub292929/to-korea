'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  Download,
  Mail,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  User,
  GraduationCap,
  Globe,
  Calendar,
  MessageSquare,
  AlertCircle,
  DollarSign,
  Eye,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import { subscribeToApplication, updateApplicationStatus } from '@/lib/services/applicationService';
import type { Application, ApplicationStatus } from '@/lib/types/application';
import { EDUCATION_LEVELS, LANGUAGE_TESTS, NATIONALITIES } from '@/lib/types/application';

const statusConfig: Record<ApplicationStatus, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  draft: { label: 'Draft', icon: FileText, bg: 'bg-gray-100', text: 'text-gray-700' },
  submitted: { label: 'Submitted', icon: Clock, bg: 'bg-blue-100', text: 'text-blue-700' },
  paid: { label: 'Paid', icon: DollarSign, bg: 'bg-green-100', text: 'text-green-700' },
  under_review: { label: 'Under Review', icon: Eye, bg: 'bg-amber-100', text: 'text-amber-700' },
  accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-emerald-100', text: 'text-emerald-700' },
  rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-100', text: 'text-red-700' },
};

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToApplication(id, (data) => {
      if (data) {
        setApplication(data);
        setError('');
      } else {
        setError('Application not found');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [id]);

  const handleStatusChange = async (newStatus: ApplicationStatus) => {
    if (!application) return;

    setUpdating(true);
    try {
      await updateApplicationStatus(id, newStatus);
      // No need to manually update state - real-time subscription will handle it
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status');
    } finally {
      setUpdating(false);
    }
  };

  const getNationalityLabel = (value: string) => {
    const nation = NATIONALITIES.find(n => n.value === value);
    return nation?.label || value;
  };

  const getEducationLabel = (value: string) => {
    const edu = EDUCATION_LEVELS.find(e => e.value === value);
    return edu?.label || value;
  };

  const getLanguageTestLabel = (value: string) => {
    const test = LANGUAGE_TESTS.find(t => t.value === value);
    return test?.label || value;
  };

  const formatDate = (date: any) => {
    if (!date) return '-';
    const dateObj = typeof date === 'object' && 'toDate' in date
      ? date.toDate()
      : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout title="Application Details" subtitle="Loading...">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !application) {
    return (
      <AdminLayout title="Application Details" subtitle="Error">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-red-600 mb-4">{error || 'Application not found'}</p>
          <Link href="/admin/applications" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Applications
          </Link>
        </div>
      </AdminLayout>
    );
  }

  const currentStatus = statusConfig[application.status] || statusConfig.draft;
  const StatusIcon = currentStatus.icon;

  return (
    <AdminLayout title={`Application #${id.slice(0, 8)}`} subtitle="Application Details">
      {/* Back Button */}
      <Link
        href="/admin/applications"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Applications
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Applicant Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" />
              Applicant Information
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="font-medium">
                  {application.firstName && application.lastName
                    ? `${application.firstName} ${application.lastName}`
                    : <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="font-medium">{application.email || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="font-medium">{application.phone || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Nationality</p>
                <p className="font-medium">
                  {application.nationality
                    ? getNationalityLabel(application.nationality)
                    : <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date of Birth</p>
                <p className="font-medium">{application.dateOfBirth || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender</p>
                <p className="font-medium capitalize">{application.gender || <span className="text-gray-400">Not provided</span>}</p>
              </div>
            </div>
          </div>

          {/* Application Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5" />
              Application Details
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">School</p>
                <p className="font-medium">{application.schoolName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Program</p>
                <p className="font-medium">{application.intendedProgram || <span className="text-gray-400">Not selected</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Target Semester</p>
                <p className="font-medium">{application.intendedSemester || <span className="text-gray-400">Not selected</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Current Step</p>
                <p className="font-medium">Step {application.currentStep} of 3</p>
              </div>
            </div>
          </div>

          {/* Education Background */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Education Background</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Education Level</p>
                <p className="font-medium">
                  {application.educationLevel
                    ? getEducationLabel(application.educationLevel)
                    : <span className="text-gray-400">Not provided</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Previous School</p>
                <p className="font-medium">{application.schoolNamePrevious || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Major</p>
                <p className="font-medium">{application.major || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Graduation Year</p>
                <p className="font-medium">{application.graduationYear || <span className="text-gray-400">Not provided</span>}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">GPA</p>
                <p className="font-medium">{application.gpa || <span className="text-gray-400">Not provided</span>}</p>
              </div>
            </div>
          </div>

          {/* Languages */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Language Proficiency
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Language Test</p>
                <p className="font-medium">
                  {application.languageTest
                    ? getLanguageTestLabel(application.languageTest)
                    : <span className="text-gray-400">None</span>}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Score</p>
                <p className="font-medium">{application.languageScore || <span className="text-gray-400">-</span>}</p>
              </div>
            </div>
          </div>

          {/* Motivation */}
          {application.motivation && (
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Motivation Statement</h3>
              <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                {application.motivation}
              </p>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <StatusIcon className={`w-5 h-5 ${currentStatus.text}`} />
                <span className={`px-3 py-1 ${currentStatus.bg} ${currentStatus.text} rounded-full text-sm font-medium`}>
                  {currentStatus.label}
                </span>
              </div>

              {application.paymentAmount && (
                <div className="flex items-center gap-2">
                  <DollarSign className="w-5 h-5 text-green-500" />
                  <span className="text-green-600 font-medium">${application.paymentAmount} paid</span>
                </div>
              )}
            </div>

            <div className="mt-6 space-y-2">
              <button
                onClick={() => handleStatusChange('under_review')}
                disabled={updating || application.status === 'under_review'}
                className="w-full flex items-center justify-center gap-2 h-10 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50"
              >
                <Eye className="w-4 h-4" />
                Mark Under Review
              </button>
              <button
                onClick={() => handleStatusChange('accepted')}
                disabled={updating || application.status === 'accepted'}
                className="w-full flex items-center justify-center gap-2 h-10 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50"
              >
                <CheckCircle className="w-4 h-4" />
                Accept
              </button>
              <button
                onClick={() => handleStatusChange('rejected')}
                disabled={updating || application.status === 'rejected'}
                className="w-full flex items-center justify-center gap-2 h-10 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                Reject
              </button>
              <button className="w-full flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg hover:bg-gray-50">
                <Mail className="w-4 h-4" />
                Send Email
              </button>
            </div>
          </div>

          {/* Timeline */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Timeline
            </h3>
            <div className="space-y-4">
              {application.paidAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 bg-green-500 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">Payment completed</p>
                    <p className="text-xs text-gray-500">{formatDate(application.paidAt)}</p>
                  </div>
                </div>
              )}
              {application.submittedAt && (
                <div className="flex gap-3">
                  <div className="w-2 h-2 mt-2 bg-blue-500 rounded-full" />
                  <div>
                    <p className="text-sm text-gray-900">Application submitted</p>
                    <p className="text-xs text-gray-500">{formatDate(application.submittedAt)}</p>
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-2 h-2 mt-2 bg-gray-300 rounded-full" />
                <div>
                  <p className="text-sm text-gray-900">Application created</p>
                  <p className="text-xs text-gray-500">{formatDate(application.createdAt)}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Internal Notes */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <MessageSquare className="w-5 h-5" />
              Internal Notes
            </h3>
            <textarea
              placeholder="Add a note..."
              className="w-full h-24 p-3 border border-gray-200 rounded-lg text-sm resize-none focus:outline-none focus:border-[var(--leica-orange)]"
            />
            <button className="mt-2 w-full h-9 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200">
              Add Note
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
