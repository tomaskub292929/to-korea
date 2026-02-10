'use client';

import { useState, useEffect } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getApplicationById } from '@/lib/services/applicationService';
import { generateReferenceNumber } from '@/lib/services/applicationService';
import type { Application } from '@/lib/types/application';

export default function CompletePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const schoolId = params.schoolId as string;
  const applicationId = searchParams.get('applicationId');

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [referenceNumber] = useState(generateReferenceNumber());

  useEffect(() => {
    async function loadApplication() {
      if (!applicationId) {
        setError('Application ID is missing');
        setLoading(false);
        return;
      }

      try {
        const app = await getApplicationById(applicationId);
        if (!app) {
          setError('Application not found');
        } else if (app.userId !== user?.id) {
          setError('Unauthorized access');
        } else {
          setApplication(app);
        }
      } catch (err) {
        console.error('Error loading application:', err);
        setError('Failed to load application');
      } finally {
        setLoading(false);
      }
    }

    if (user) {
      loadApplication();
    } else {
      setLoading(false);
    }
  }, [applicationId, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--md-surface)] flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[var(--md-on-surface-variant)]">Loading...</p>
        </div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="min-h-screen bg-[var(--md-surface)] flex items-center justify-center p-4">
        <div className="md-card-outlined max-w-md w-full text-center p-8">
          <div className="w-16 h-16 bg-[var(--md-error-container)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">❌</span>
          </div>
          <h1 className="text-xl font-medium text-[var(--md-on-surface)] mb-2">Error</h1>
          <p className="text-[var(--md-on-surface-variant)] mb-6">{error || 'Application not found'}</p>
          <Link href="/" className="md-btn-filled">
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--md-surface)]">
      {/* Success Header */}
      <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white py-12 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-4xl">✅</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Application Complete!</h1>
          <p className="text-white/90">Your application has been successfully submitted</p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4 -mt-6">
        {/* Application Summary Card */}
        <div className="md-card-elevated mb-6">
          <div className="text-center pb-6 mb-6 border-b border-[var(--md-outline-variant)]">
            <p className="text-sm text-[var(--md-on-surface-variant)] mb-1">Reference Number</p>
            <p className="text-2xl font-mono font-bold text-[var(--md-primary)]">{referenceNumber}</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-[var(--md-on-surface-variant)]">School</span>
              <span className="font-medium text-[var(--md-on-surface)]">{application.schoolName}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--md-on-surface-variant)]">Program</span>
              <span className="font-medium text-[var(--md-on-surface)]">{application.intendedProgram}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--md-on-surface-variant)]">Semester</span>
              <span className="font-medium text-[var(--md-on-surface)]">{application.intendedSemester}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[var(--md-on-surface-variant)]">Applicant</span>
              <span className="font-medium text-[var(--md-on-surface)]">
                {application.firstName} {application.lastName}
              </span>
            </div>
            {application.paymentAmount && (
              <div className="flex justify-between items-center pt-4 border-t border-[var(--md-outline-variant)]">
                <span className="text-[var(--md-on-surface-variant)]">Amount Paid</span>
                <span className="text-lg font-bold text-green-600">${application.paymentAmount}</span>
              </div>
            )}
          </div>
        </div>

        {/* Email Confirmation */}
        <div className="md-card-filled mb-6 flex items-start gap-4">
          <div className="w-10 h-10 bg-[var(--md-primary)] rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white">📧</span>
          </div>
          <div>
            <p className="font-medium text-[var(--md-on-surface)]">Confirmation Email Sent</p>
            <p className="text-sm text-[var(--md-on-surface-variant)]">
              We&apos;ve sent a confirmation email to <strong>{application.email}</strong> with your application details and next steps.
            </p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="md-card-outlined mb-6">
          <h2 className="text-lg font-medium text-[var(--md-on-surface)] mb-4 flex items-center gap-2">
            <span>📋</span>
            <span>Next Steps</span>
          </h2>

          <div className="space-y-4">
            {[
              {
                step: 1,
                title: 'Check Your Email',
                description: 'Review the confirmation email for detailed instructions about document submission.',
                icon: '📬',
              },
              {
                step: 2,
                title: 'Prepare Required Documents',
                description: 'Gather your passport, transcripts, and any additional required documents.',
                icon: '📄',
              },
              {
                step: 3,
                title: 'Upload Documents (Within 7 Days)',
                description: 'Submit your documents through our portal before the deadline.',
                icon: '📤',
              },
              {
                step: 4,
                title: 'Wait for Review',
                description: 'Our team will review your application and contact you within 2-3 weeks.',
                icon: '⏳',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-8 h-8 bg-[var(--md-primary-container)] rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium text-[var(--md-on-primary-container)]">
                  {item.step}
                </div>
                <div>
                  <p className="font-medium text-[var(--md-on-surface)]">
                    {item.icon} {item.title}
                  </p>
                  <p className="text-sm text-[var(--md-on-surface-variant)]">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Important Notice */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <p className="font-medium text-amber-800">Important Notice</p>
              <p className="text-sm text-amber-700">
                Please save your reference number <strong>{referenceNumber}</strong> for future inquiries. You can use this number to check the status of your application.
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => window.print()}
            className="flex-1 py-3 px-6 border border-[var(--md-outline)] text-[var(--md-on-surface)] font-medium rounded-full hover:bg-[var(--md-surface-variant)] transition-colors flex items-center justify-center gap-2"
          >
            <span>📄</span>
            <span>Download Receipt</span>
          </button>
          <Link
            href="/"
            className="flex-1 py-3 px-6 bg-[var(--md-primary)] text-white font-medium rounded-full hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
          >
            <span>🏠</span>
            <span>Back to Home</span>
          </Link>
        </div>

        {/* Support Info */}
        <div className="text-center mt-8 py-6 border-t border-[var(--md-outline-variant)]">
          <p className="text-sm text-[var(--md-on-surface-variant)] mb-2">Need help?</p>
          <p className="text-[var(--md-on-surface)]">
            Contact us at{' '}
            <a href="mailto:support@inbeam.edu" className="text-[var(--md-primary)] hover:underline">
              support@inbeam.edu
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
