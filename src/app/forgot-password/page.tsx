'use client';

import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Mail, CheckCircle } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setSubmitted(true);
    }, 1000);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <main className="max-w-md mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl p-8 shadow-lg text-center">
            <div className="w-16 h-16 bg-[var(--success)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--success)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--deep-navy)] mb-2">Check Your Email</h1>
            <p className="text-[var(--warm-gray)] mb-6">
              We've sent password reset instructions to <strong className="text-[var(--deep-navy)]">{email}</strong>
            </p>
            <p className="text-sm text-[var(--warm-gray)] mb-6">
              Didn't receive the email? Check your spam folder or try again.
            </p>
            <div className="space-y-3">
              <Button variant="secondary" className="w-full" onClick={() => setSubmitted(false)}>
                Try Another Email
              </Button>
              <Link href="/login" className="block">
                <Button variant="primary" className="w-full">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-md mx-auto px-4 py-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/login" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Login
          </Link>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl p-8 shadow-lg">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[var(--leica-orange)]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Mail className="w-8 h-8 text-[var(--leica-orange)]" />
            </div>
            <h1 className="text-2xl font-bold text-[var(--deep-navy)]">Forgot Password?</h1>
            <p className="text-[var(--warm-gray)] mt-2">
              No worries! Enter your email and we'll send you reset instructions.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full h-11 pl-12 pr-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                  required
                />
              </div>
            </div>

            <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
              Send Reset Link
            </Button>
          </form>

          {/* Login Link */}
          <p className="text-center text-[var(--warm-gray)] mt-6">
            Remember your password?{' '}
            <Link href="/login" className="text-[var(--leica-orange)] font-medium hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
