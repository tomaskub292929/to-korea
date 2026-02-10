'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { Mail, CheckCircle, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function VerifyEmailPage() {
  const router = useRouter();
  const { user, sendVerificationEmail, reloadUser } = useAuth();
  const [isSending, setIsSending] = useState(false);
  const [message, setMessage] = useState('');
  const [isChecking, setIsChecking] = useState(false);

  const handleResendEmail = async () => {
    setMessage('');
    setIsSending(true);

    try {
      await sendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error: any) {
      setMessage(error.message || 'Failed to send verification email');
    } finally {
      setIsSending(false);
    }
  };

  const handleCheckVerification = async () => {
    setMessage('');
    setIsChecking(true);

    try {
      await reloadUser();

      // Check if email is now verified
      if (user?.emailVerified) {
        setMessage('Email verified successfully! Redirecting...');
        setTimeout(() => {
          router.push('/');
        }, 2000);
      } else {
        setMessage('Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error: any) {
      setMessage('Failed to check verification status');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16">
        <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
          {/* Icon */}
          <div className="w-20 h-20 bg-[var(--leica-orange)]/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <Mail className="w-10 h-10 text-[var(--leica-orange)]" />
          </div>

          {/* Header */}
          <h1 className="text-2xl font-bold text-[var(--deep-navy)] mb-2">
            Verify Your Email
          </h1>
          <p className="text-[var(--warm-gray)] mb-8">
            We've sent a verification link to{' '}
            <span className="font-medium text-[var(--deep-navy)]">
              {user?.email}
            </span>
          </p>

          {/* Message */}
          {message && (
            <div
              className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
                message.includes('success') || message.includes('sent')
                  ? 'bg-green-50 text-green-700'
                  : message.includes('not verified')
                  ? 'bg-yellow-50 text-yellow-700'
                  : 'bg-red-50 text-red-700'
              }`}
            >
              {message.includes('success') ? (
                <CheckCircle className="w-5 h-5 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
              )}
              <span className="text-sm text-left">{message}</span>
            </div>
          )}

          {/* Instructions */}
          <div className="text-left mb-8">
            <h3 className="font-medium text-[var(--deep-navy)] mb-3">
              What's next?
            </h3>
            <ol className="space-y-2 text-sm text-[var(--warm-gray)]">
              <li className="flex gap-2">
                <span className="font-medium text-[var(--leica-orange)]">1.</span>
                <span>Check your email inbox</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[var(--leica-orange)]">2.</span>
                <span>Click the verification link in the email</span>
              </li>
              <li className="flex gap-2">
                <span className="font-medium text-[var(--leica-orange)]">3.</span>
                <span>Come back here and click "I've Verified My Email"</span>
              </li>
            </ol>
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="primary"
              className="w-full"
              onClick={handleCheckVerification}
              isLoading={isChecking}
            >
              I've Verified My Email
            </Button>

            <Button
              variant="secondary"
              className="w-full"
              onClick={handleResendEmail}
              isLoading={isSending}
            >
              Resend Verification Email
            </Button>
          </div>

          {/* Help */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <p className="text-sm text-[var(--warm-gray)] mb-2">
              Didn't receive the email?
            </p>
            <ul className="text-xs text-[var(--warm-gray)] space-y-1">
              <li>• Check your spam or junk folder</li>
              <li>• Make sure {user?.email} is correct</li>
              <li>• Try resending the verification email</li>
            </ul>
          </div>

          {/* Skip for now */}
          <div className="mt-6">
            <Link
              href="/"
              className="text-sm text-[var(--leica-orange)] hover:underline"
            >
              Skip for now, I'll verify later
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
