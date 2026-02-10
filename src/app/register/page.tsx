'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, User, Mail, Lock, Eye, EyeOff, Globe, CheckCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    country: '',
    agreeTerms: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate terms agreement
    if (!formData.agreeTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      await register({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        agreeTerms: formData.agreeTerms,
      });

      setSuccess(true);

      // Redirect to verification reminder page after 2 seconds
      setTimeout(() => {
        router.push('/verify-email');
      }, 2000);
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const updateField = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const benefits = [
    'Save your favorite schools',
    'Track your applications',
    'Get personalized recommendations',
    'Receive updates on deadlines',
  ];

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 py-16">
        {/* Back Link */}
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left: Benefits */}
          <div className="hidden md:block">
            <h2 className="text-3xl font-bold text-[var(--deep-navy)] mb-4">
              Start Your Journey to Korea
            </h2>
            <p className="text-[var(--warm-gray)] mb-8">
              Create a free account and unlock all the features to help you find the perfect school.
            </p>

            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-[var(--success)]" />
                  <span className="text-[var(--deep-navy)]">{benefit}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 p-6 bg-gradient-to-br from-[var(--leica-orange)]/10 to-[var(--leica-gold)]/10 rounded-xl">
              <p className="text-[var(--deep-navy)] italic">
                "Gateway to Korea made my application process so much easier.
                I found my dream university within a week!"
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-[var(--leica-orange)] rounded-full flex items-center justify-center text-white font-bold">A</div>
                <div>
                  <div className="font-medium text-[var(--deep-navy)]">Anna M.</div>
                  <div className="text-sm text-[var(--warm-gray)]">Student from Germany</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Form */}
          <div className="bg-white rounded-2xl p-8 shadow-lg">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-bold text-[var(--deep-navy)]">Create Account</h1>
              <p className="text-[var(--warm-gray)] mt-2">Join 10,000+ students</p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}

            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-4">
                Account created successfully! A verification email has been sent. Redirecting...
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name Fields */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">First Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => updateField('firstName', e.target.value)}
                      placeholder="John"
                      className="w-full h-11 pl-12 pr-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => updateField('lastName', e.target.value)}
                    placeholder="Doe"
                    className="w-full h-11 px-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="you@example.com"
                    className="w-full h-11 pl-12 pr-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => updateField('password', e.target.value)}
                    placeholder="Create a strong password"
                    className="w-full h-11 pl-12 pr-12 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--warm-gray)] hover:text-[var(--deep-navy)]"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-[var(--warm-gray)] mt-1">At least 8 characters</p>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">Country</label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--warm-gray)]" />
                  <select
                    value={formData.country}
                    onChange={(e) => updateField('country', e.target.value)}
                    className="w-full h-11 pl-12 pr-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] focus:outline-none focus:border-2 focus:border-[var(--leica-orange)] appearance-none"
                    required
                  >
                    <option value="">Select your country</option>
                    <option value="germany">Germany</option>
                    <option value="france">France</option>
                    <option value="russia">Russia</option>
                    <option value="kazakhstan">Kazakhstan</option>
                    <option value="uzbekistan">Uzbekistan</option>
                    <option value="italy">Italy</option>
                    <option value="spain">Spain</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.agreeTerms}
                  onChange={(e) => updateField('agreeTerms', e.target.checked)}
                  className="mt-1 w-4 h-4 rounded border-gray-300 text-[var(--leica-orange)] focus:ring-[var(--leica-orange)]"
                  required
                />
                <span className="text-sm text-[var(--warm-gray)]">
                  I agree to the{' '}
                  <Link href="/terms" className="text-[var(--leica-orange)] hover:underline">Terms of Service</Link>
                  {' '}and{' '}
                  <Link href="/privacy" className="text-[var(--leica-orange)] hover:underline">Privacy Policy</Link>
                </span>
              </label>

              {/* Submit */}
              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Create Account
              </Button>
            </form>

            {/* Login Link */}
            <p className="text-center text-[var(--warm-gray)] mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-[var(--leica-orange)] font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
