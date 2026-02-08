'use client';

import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowLeft, Shield } from 'lucide-react';

export default function PrivacyPage() {
  const sections = [
    {
      title: '1. Information We Collect',
      content: `We collect information you provide directly to us, such as when you create an account, apply to schools, or contact us. This includes:

• Personal information (name, email, phone number)
• Educational background and documents
• Country of origin and language preferences
• Application materials and preferences`,
    },
    {
      title: '2. How We Use Your Information',
      content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process school applications on your behalf
• Send you updates about schools and deadlines
• Respond to your comments and questions
• Personalize your experience on our platform`,
    },
    {
      title: '3. Information Sharing',
      content: `We may share your information in the following circumstances:

• With schools you apply to (with your consent)
• With service providers who assist our operations
• To comply with legal obligations
• To protect our rights and prevent fraud

We never sell your personal information to third parties.`,
    },
    {
      title: '4. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. This includes encryption, secure servers, and regular security audits.`,
    },
    {
      title: '5. Your Rights',
      content: `You have the right to:

• Access your personal information
• Correct inaccurate data
• Delete your account and data
• Export your data
• Opt out of marketing communications

To exercise these rights, contact us at privacy@gatewaytokorea.com`,
    },
    {
      title: '6. Cookies and Tracking',
      content: `We use cookies and similar technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control cookie preferences through your browser settings.`,
    },
    {
      title: '7. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own, including South Korea. We ensure appropriate safeguards are in place to protect your data in accordance with this policy.`,
    },
    {
      title: '8. Changes to This Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.`,
    },
    {
      title: '9. Contact Us',
      content: `If you have any questions about this Privacy Policy, please contact us at:

Email: privacy@gatewaytokorea.com
Address: Seoul, South Korea`,
    },
  ];

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Header */}
        <div className="bg-white rounded-2xl p-8 shadow-sm mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 bg-[var(--leica-orange)]/10 rounded-xl flex items-center justify-center">
              <Shield className="w-7 h-7 text-[var(--leica-orange)]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)]">
                Privacy Policy
              </h1>
              <p className="text-[var(--warm-gray)]">Last updated: February 1, 2026</p>
            </div>
          </div>
          <p className="text-[var(--warm-gray)] leading-relaxed">
            At Gateway to Korea, we are committed to protecting your privacy. This Privacy Policy
            explains how we collect, use, disclose, and safeguard your information when you use our platform.
          </p>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {sections.map((section, index) => (
            <div key={index} className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-xl font-bold text-[var(--deep-navy)] mb-4">{section.title}</h2>
              <div className="text-[var(--warm-gray)] leading-relaxed whitespace-pre-line">
                {section.content}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--leica-orange)]/10 to-[var(--leica-gold)]/10 rounded-xl">
          <p className="text-[var(--deep-navy)] text-center">
            By using Gateway to Korea, you agree to the collection and use of information in accordance with this policy.
          </p>
        </div>
      </main>

      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
