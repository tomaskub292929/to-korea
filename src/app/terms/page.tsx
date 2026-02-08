'use client';

import { Header } from '@/components/layout/Header';
import Link from 'next/link';
import { ArrowLeft, FileText } from 'lucide-react';

export default function TermsPage() {
  const sections = [
    {
      title: '1. Acceptance of Terms',
      content: `By accessing or using Gateway to Korea ("the Platform"), you agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our services.`,
    },
    {
      title: '2. Description of Service',
      content: `Gateway to Korea provides a platform connecting international students with educational institutions in South Korea. Our services include:

• School search and discovery
• Application guidance and support
• Information about studying and living in Korea
• Personalized recommendations

We act as a facilitator and do not guarantee admission to any institution.`,
    },
    {
      title: '3. User Accounts',
      content: `To access certain features, you must create an account. You agree to:

• Provide accurate and complete information
• Maintain the security of your account credentials
• Notify us immediately of any unauthorized access
• Accept responsibility for all activities under your account

You must be at least 16 years old to create an account.`,
    },
    {
      title: '4. User Conduct',
      content: `You agree not to:

• Provide false or misleading information
• Use the platform for any unlawful purpose
• Interfere with or disrupt the platform's operation
• Attempt to gain unauthorized access to our systems
• Copy, modify, or distribute our content without permission
• Use automated systems to access the platform`,
    },
    {
      title: '5. Intellectual Property',
      content: `All content on Gateway to Korea, including text, graphics, logos, and software, is our property or that of our licensors and is protected by intellectual property laws. You may not use our content without express written permission.`,
    },
    {
      title: '6. Third-Party Services',
      content: `Our platform may contain links to third-party websites and services, including educational institutions. We are not responsible for the content, policies, or practices of these third parties. Your interactions with them are governed by their own terms and policies.`,
    },
    {
      title: '7. Application Process',
      content: `When applying to schools through our platform:

• You are responsible for the accuracy of your application materials
• We do not guarantee acceptance to any program
• Application fees, if any, are non-refundable
• Admission decisions are made solely by educational institutions`,
    },
    {
      title: '8. Disclaimer of Warranties',
      content: `The platform is provided "as is" without warranties of any kind. We do not warrant that:

• The service will be uninterrupted or error-free
• Information about schools is completely accurate or current
• The platform will meet your specific requirements

We are not responsible for admission decisions or outcomes.`,
    },
    {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law, Gateway to Korea shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the platform, including but not limited to loss of data, opportunities, or profits.`,
    },
    {
      title: '10. Modifications to Terms',
      content: `We reserve the right to modify these Terms of Service at any time. Changes will be effective immediately upon posting. Your continued use of the platform after changes constitutes acceptance of the new terms.`,
    },
    {
      title: '11. Termination',
      content: `We may terminate or suspend your account at any time for violations of these terms or for any other reason at our discretion. Upon termination, your right to use the platform ceases immediately.`,
    },
    {
      title: '12. Governing Law',
      content: `These Terms shall be governed by the laws of the Republic of Korea. Any disputes shall be resolved in the courts of Seoul, South Korea.`,
    },
    {
      title: '13. Contact Information',
      content: `For questions about these Terms of Service, please contact us at:

Email: legal@gatewaytokorea.com
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
              <FileText className="w-7 h-7 text-[var(--leica-orange)]" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)]">
                Terms of Service
              </h1>
              <p className="text-[var(--warm-gray)]">Last updated: February 1, 2026</p>
            </div>
          </div>
          <p className="text-[var(--warm-gray)] leading-relaxed">
            Please read these Terms of Service carefully before using Gateway to Korea.
            These terms govern your access to and use of our platform and services.
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

        {/* Agreement Note */}
        <div className="mt-8 p-6 bg-gradient-to-r from-[var(--leica-orange)]/10 to-[var(--leica-gold)]/10 rounded-xl">
          <p className="text-[var(--deep-navy)] text-center">
            By using Gateway to Korea, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.
          </p>
        </div>
      </main>

      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
