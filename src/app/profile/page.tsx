'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Header } from '@/components/layout/Header';
import { useAuth } from '@/contexts/AuthContext';
import { getApplicationsByUserId } from '@/lib/services/applicationService';
import { Application } from '@/lib/types/application';
import {
  User,
  Mail,
  Calendar,
  FileText,
  ChevronRight,
  Settings,
  Shield,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
} from 'lucide-react';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/login');
    }
  }, [user, authLoading, router]);

  useEffect(() => {
    async function fetchApplications() {
      if (user) {
        try {
          const apps = await getApplicationsByUserId(user.id);
          setApplications(apps);
        } catch (error) {
          console.error('Error fetching applications:', error);
        } finally {
          setLoading(false);
        }
      }
    }

    if (user) {
      fetchApplications();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'under_review':
      case 'submitted':
      case 'paid':
        return <Clock className="w-5 h-5 text-amber-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'Accepted';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      case 'draft':
        return 'Draft';
      case 'submitted':
        return 'Submitted';
      case 'paid':
        return 'Payment Completed';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Profile Header */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 rounded-full bg-[var(--md-primary-container)] flex items-center justify-center">
              <User className="w-10 h-10 text-[var(--md-on-primary-container)]" />
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-[var(--deep-navy)]">
                {user.firstName} {user.lastName}
              </h1>
              <div className="flex items-center gap-2 text-[var(--warm-gray)] mt-1">
                <Mail className="w-4 h-4" />
                <span>{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-[var(--warm-gray)] mt-1">
                <Shield className="w-4 h-4" />
                <span className="capitalize">{user.role} Account</span>
              </div>
              {user.createdAt && (
                <div className="flex items-center gap-2 text-[var(--warm-gray)] mt-1">
                  <Calendar className="w-4 h-4" />
                  <span>
                    Member since{' '}
                    {new Date(user.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/schools"
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--leica-orange)]/10 flex items-center justify-center">
              <FileText className="w-6 h-6 text-[var(--leica-orange)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--deep-navy)]">Browse Schools</h3>
              <p className="text-sm text-[var(--warm-gray)]">Find your perfect university</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>

          <Link
            href="/board"
            className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-[var(--md-primary)]/10 flex items-center justify-center">
              <Settings className="w-6 h-6 text-[var(--md-primary)]" />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-[var(--deep-navy)]">Community</h3>
              <p className="text-sm text-[var(--warm-gray)]">Connect with other students</p>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </Link>
        </div>

        {/* Applications */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[var(--deep-navy)] mb-4 flex items-center gap-2">
            <FileText className="w-5 h-5 text-[var(--leica-orange)]" />
            My Applications
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="w-6 h-6 border-2 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="font-medium text-[var(--deep-navy)] mb-2">No applications yet</h3>
              <p className="text-[var(--warm-gray)] mb-4">
                Start your journey by applying to a school
              </p>
              <Link
                href="/schools"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] transition-colors"
              >
                Browse Schools
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <div
                  key={app.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-[var(--leica-orange)] transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium text-[var(--deep-navy)]">{app.schoolName}</h3>
                      <p className="text-sm text-[var(--warm-gray)] mt-1">
                        Applied:{' '}
                        {app.createdAt
                          ? new Date(
                              typeof app.createdAt === 'object' && 'toDate' in app.createdAt
                                ? app.createdAt.toDate()
                                : app.createdAt
                            ).toLocaleDateString()
                          : 'Unknown'}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(app.status)}
                      <span
                        className={`text-sm font-medium ${
                          app.status === 'accepted'
                            ? 'text-green-600'
                            : app.status === 'rejected'
                            ? 'text-red-600'
                            : 'text-amber-600'
                        }`}
                      >
                        {getStatusLabel(app.status)}
                      </span>
                    </div>
                  </div>
                  {app.status === 'draft' && (
                    <Link
                      href={`/apply/${app.schoolId}`}
                      className="mt-3 inline-flex items-center gap-1 text-sm text-[var(--leica-orange)] hover:underline"
                    >
                      Continue Application
                      <ChevronRight className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 InBeam Test. All rights reserved.</p>
      </footer>
    </div>
  );
}
