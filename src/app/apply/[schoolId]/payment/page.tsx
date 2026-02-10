'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { getApplicationById, updateApplicationPayment } from '@/lib/services/applicationService';
import { PAYMENT_ITEMS, PREMIUM_CONSULTING } from '@/lib/types/application';
import type { Application, PaymentItem, PaymentMethod } from '@/lib/types/application';

export default function PaymentPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user } = useAuth();
  const schoolId = params.schoolId as string;
  const applicationId = searchParams.get('applicationId');

  const [application, setApplication] = useState<Application | null>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [includePremium, setIncludePremium] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [discount, setDiscount] = useState(0);

  // Card details (for demo - in production use Stripe Elements)
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvc, setCvc] = useState('');
  const [cardName, setCardName] = useState('');

  // Calculate totals
  const baseItems = PAYMENT_ITEMS;
  const allItems = includePremium ? [...baseItems, PREMIUM_CONSULTING] : baseItems;
  const subtotal = allItems.reduce((sum, item) => sum + item.amount * item.quantity, 0);
  const total = subtotal - discount;

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

  const handleApplyPromo = () => {
    // Demo promo codes
    if (promoCode.toUpperCase() === 'WELCOME10') {
      setDiscount(Math.round(subtotal * 0.1));
      setPromoApplied(true);
    } else if (promoCode.toUpperCase() === 'STUDY2026') {
      setDiscount(20);
      setPromoApplied(true);
    } else {
      alert('Invalid promo code');
    }
  };

  const handlePayment = async () => {
    if (!application || !applicationId) return;

    // Validate card details (basic validation for demo)
    if (paymentMethod === 'card') {
      if (!cardNumber || !expiryDate || !cvc || !cardName) {
        alert('Please fill in all card details');
        return;
      }
    }

    setProcessing(true);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update application with payment info
      const paymentId = `PAY-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await updateApplicationPayment(applicationId, paymentId, 'completed', total);

      // Redirect to complete page
      router.push(`/apply/${schoolId}/complete?applicationId=${applicationId}`);
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment failed. Please try again.');
      setProcessing(false);
    }
  };

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
          <Link href={`/schools/${schoolId}`} className="md-btn-filled">
            Back to School
          </Link>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[var(--md-surface)] flex items-center justify-center p-4">
        <div className="md-card-outlined max-w-md w-full text-center p-8">
          <h1 className="text-xl font-medium text-[var(--md-on-surface)] mb-4">Login Required</h1>
          <p className="text-[var(--md-on-surface-variant)] mb-6">Please login to continue with payment.</p>
          <Link href="/login" className="md-btn-filled">
            Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--md-surface)]">
      {/* Header */}
      <div className="bg-[var(--md-primary)] text-white py-4 px-4">
        <div className="max-w-4xl mx-auto">
          <Link href={`/apply/${schoolId}?applicationId=${applicationId}`} className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-2">
            <span>←</span>
            <span>Back to Application</span>
          </Link>
          <h1 className="text-xl font-medium">{application.schoolName}</h1>
          <p className="text-white/80 text-sm">Payment</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 py-8">
        <div className="grid md:grid-cols-5 gap-6">
          {/* Order Summary - Left Side */}
          <div className="md:col-span-2">
            <div className="md-card-outlined sticky top-4">
              <h2 className="text-lg font-medium text-[var(--md-on-surface)] mb-4">Order Summary</h2>

              {/* School Info */}
              <div className="pb-4 mb-4 border-b border-[var(--md-outline-variant)]">
                <p className="font-medium text-[var(--md-on-surface)]">{application.schoolName}</p>
                <p className="text-sm text-[var(--md-on-surface-variant)]">{application.intendedProgram}</p>
                <p className="text-sm text-[var(--md-on-surface-variant)]">{application.intendedSemester}</p>
              </div>

              {/* Items */}
              <div className="space-y-3 mb-4">
                {baseItems.map((item, index) => (
                  <div key={index} className="flex justify-between">
                    <div>
                      <p className="text-sm text-[var(--md-on-surface)]">{item.name}</p>
                      <p className="text-xs text-[var(--md-on-surface-variant)]">{item.description}</p>
                    </div>
                    <p className="text-sm font-medium">${item.amount}</p>
                  </div>
                ))}

                {/* Premium Option */}
                <label className="flex items-start gap-3 p-3 bg-[var(--md-surface-variant)] rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={includePremium}
                    onChange={(e) => setIncludePremium(e.target.checked)}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[var(--md-on-surface)]">{PREMIUM_CONSULTING.name}</p>
                    <p className="text-xs text-[var(--md-on-surface-variant)]">{PREMIUM_CONSULTING.description}</p>
                  </div>
                  <p className="text-sm font-medium text-[var(--md-primary)]">+${PREMIUM_CONSULTING.amount}</p>
                </label>
              </div>

              {/* Promo Code */}
              <div className="pb-4 mb-4 border-b border-[var(--md-outline-variant)]">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    placeholder="Promo code"
                    disabled={promoApplied}
                    className="flex-1 px-3 py-2 text-sm border border-[var(--md-outline)] rounded-lg focus:outline-none focus:border-[var(--md-primary)]"
                  />
                  <button
                    onClick={handleApplyPromo}
                    disabled={promoApplied || !promoCode}
                    className="px-4 py-2 text-sm bg-[var(--md-surface-variant)] text-[var(--md-on-surface)] rounded-lg hover:bg-[var(--md-outline-variant)] disabled:opacity-50"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </button>
                </div>
                {promoApplied && (
                  <p className="text-xs text-green-600 mt-2">✓ Promo code applied! -${discount}</p>
                )}
              </div>

              {/* Total */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[var(--md-on-surface-variant)]">Subtotal</span>
                  <span>${subtotal}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Discount</span>
                    <span>-${discount}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-medium pt-2 border-t border-[var(--md-outline-variant)]">
                  <span>Total</span>
                  <span className="text-[var(--md-primary)]">${total}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Right Side */}
          <div className="md:col-span-3">
            <div className="md-card-outlined">
              <h2 className="text-lg font-medium text-[var(--md-on-surface)] mb-6">Payment Method</h2>

              {/* Payment Method Selection */}
              <div className="space-y-3 mb-6">
                {[
                  { value: 'card', label: 'Credit / Debit Card', icon: '💳' },
                  { value: 'paypal', label: 'PayPal', icon: '🅿️' },
                  { value: 'bank_transfer', label: 'Bank Transfer', icon: '🏦' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                      paymentMethod === method.value
                        ? 'border-[var(--md-primary)] bg-[var(--md-primary-container)]/20'
                        : 'border-[var(--md-outline-variant)] hover:border-[var(--md-outline)]'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
                      className="w-4 h-4"
                    />
                    <span className="text-xl">{method.icon}</span>
                    <span className="font-medium text-[var(--md-on-surface)]">{method.label}</span>
                  </label>
                ))}
              </div>

              {/* Card Details */}
              {paymentMethod === 'card' && (
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-[var(--md-outline)] rounded-lg focus:outline-none focus:border-[var(--md-primary)]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      placeholder="JOHN DOE"
                      className="w-full px-4 py-3 border border-[var(--md-outline)] rounded-lg focus:outline-none focus:border-[var(--md-primary)]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={expiryDate}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, '');
                          if (value.length >= 2) {
                            value = value.slice(0, 2) + '/' + value.slice(2, 4);
                          }
                          setExpiryDate(value);
                        }}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full px-4 py-3 border border-[var(--md-outline)] rounded-lg focus:outline-none focus:border-[var(--md-primary)]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-[var(--md-on-surface)] mb-1">
                        CVC
                      </label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-[var(--md-outline)] rounded-lg focus:outline-none focus:border-[var(--md-primary)]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PayPal Message */}
              {paymentMethod === 'paypal' && (
                <div className="p-4 bg-[var(--md-surface-variant)] rounded-lg mb-6">
                  <p className="text-sm text-[var(--md-on-surface-variant)]">
                    You will be redirected to PayPal to complete your payment.
                  </p>
                </div>
              )}

              {/* Bank Transfer Message */}
              {paymentMethod === 'bank_transfer' && (
                <div className="p-4 bg-[var(--md-surface-variant)] rounded-lg mb-6 space-y-2">
                  <p className="text-sm font-medium text-[var(--md-on-surface)]">Bank Transfer Details</p>
                  <p className="text-sm text-[var(--md-on-surface-variant)]">
                    Bank: Woori Bank<br />
                    Account: 1002-123-456789<br />
                    Name: InBeam Education Co., Ltd.
                  </p>
                  <p className="text-xs text-[var(--md-on-surface-variant)]">
                    * Please include your application ID in the transfer memo
                  </p>
                </div>
              )}

              {/* Security Note */}
              <div className="flex items-center gap-2 text-sm text-[var(--md-on-surface-variant)] mb-6">
                <span>🔒</span>
                <span>Your payment information is encrypted and secure</span>
              </div>

              {/* Pay Button */}
              <button
                onClick={handlePayment}
                disabled={processing}
                className="w-full py-4 bg-[var(--md-primary)] text-white font-medium rounded-full hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {processing ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <span>💳</span>
                    <span>Pay ${total}</span>
                  </>
                )}
              </button>

              {/* Terms */}
              <p className="text-xs text-center text-[var(--md-on-surface-variant)] mt-4">
                By completing this purchase, you agree to our{' '}
                <Link href="/terms" className="text-[var(--md-primary)] hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-[var(--md-primary)] hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
