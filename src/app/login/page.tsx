'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, loginWithGoogle, loginWithFacebook } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login({ email, password, rememberMe });

      // Redirect to intended page or home
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithGoogle();
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setError('');
    setIsLoading(true);

    try {
      await loginWithFacebook();
      const redirect = searchParams.get('redirect') || '/';
      router.push(redirect);
    } catch (err: any) {
      setError(err.message || 'Facebook login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      {/* Back Link */}
      <div className="mb-8">
        <Link href="/" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Home
        </Link>
      </div>

      {/* Login Card */}
      <div className="bg-white rounded-2xl p-8 shadow-lg">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[var(--leica-orange)] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-white text-2xl font-bold">G</span>
          </div>
          <h1 className="text-2xl font-bold text-[var(--deep-navy)]">Welcome Back</h1>
          <p className="text-[var(--warm-gray)] mt-2">Sign in to your account</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
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

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full h-11 pl-12 pr-12 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--deep-navy)]"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-gray-300 text-[var(--leica-orange)] focus:ring-[var(--leica-orange)]"
              />
              <span className="text-[var(--warm-gray)]">Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-[var(--leica-orange)] hover:underline">
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
            Sign In
          </Button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-sm text-[var(--warm-gray)]">or continue with</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        {/* Social Login */}
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-11 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="text-sm font-medium text-[var(--deep-navy)]">Google</span>
          </button>
          <button
            type="button"
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="flex items-center justify-center gap-2 h-11 border border-gray-300 rounded hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            <span className="text-sm font-medium text-[var(--deep-navy)]">Facebook</span>
          </button>
        </div>

        {/* Register Link */}
        <p className="text-center text-[var(--warm-gray)] mt-6">
          Don't have an account?{' '}
          <Link href="/register" className="text-[var(--leica-orange)] font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />
      <Suspense fallback={
        <div className="flex items-center justify-center py-24">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  );
}
