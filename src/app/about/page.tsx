'use client';

import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowLeft, Target, Users, Globe, Award, ArrowRight } from 'lucide-react';

const values = [
  {
    icon: Target,
    title: 'Our Mission',
    description: 'To bridge the gap between international students and Korean educational institutions, making the journey to Korea accessible and transparent.',
  },
  {
    icon: Users,
    title: 'Our Community',
    description: 'We serve students from over 30 countries across Europe, Russia, and Central Asia, building a global community of learners.',
  },
  {
    icon: Globe,
    title: 'Global Reach',
    description: 'With multilingual support in English, Russian, and German, we ensure no student is left behind due to language barriers.',
  },
  {
    icon: Award,
    title: 'Quality First',
    description: 'Every school on our platform is thoroughly verified to ensure students receive accurate, reliable information.',
  },
];

const team = [
  { name: 'Sarah Kim', role: 'CEO & Founder', image: '👩‍💼' },
  { name: 'Alex Ivanov', role: 'Head of Operations', image: '👨‍💼' },
  { name: 'Maria Schmidt', role: 'Student Success Lead', image: '👩‍🎓' },
  { name: 'Park Ji-hoon', role: 'University Relations', image: '👨‍🏫' },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Hero */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-[var(--deep-navy)] mb-4">
            About <span className="text-[var(--leica-orange)]">Gateway to Korea</span>
          </h1>
          <p className="text-xl text-[var(--warm-gray)] max-w-3xl mx-auto">
            We're on a mission to help international students discover and pursue
            educational opportunities in South Korea.
          </p>
        </div>

        {/* Values */}
        <section className="mb-16">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-[var(--leica-orange)]/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-6 h-6 text-[var(--leica-orange)]" />
                </div>
                <h3 className="text-lg font-semibold text-[var(--deep-navy)] mb-2">{value.title}</h3>
                <p className="text-[var(--warm-gray)] text-sm">{value.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Story */}
        <section className="bg-white rounded-2xl p-8 md:p-12 shadow-sm mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-[var(--deep-navy)] mb-6">Our Story</h2>
            <p className="text-[var(--warm-gray)] leading-relaxed mb-6">
              Gateway to Korea was founded in 2024 by a team of educators and technologists
              who recognized the challenges international students face when seeking educational
              opportunities in South Korea.
            </p>
            <p className="text-[var(--warm-gray)] leading-relaxed mb-6">
              What started as a simple directory has grown into a comprehensive platform
              serving thousands of students from Europe, Russia, and Central Asia. We believe
              that education should know no borders, and we're committed to making Korean
              education accessible to everyone.
            </p>
            <p className="text-[var(--warm-gray)] leading-relaxed">
              Today, we partner with over 50 verified Korean universities and have helped
              more than 10,000 students begin their Korean educational journey.
            </p>
          </div>
        </section>

        {/* Team */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-[var(--deep-navy)] text-center mb-8">Meet Our Team</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center shadow-sm">
                <div className="text-5xl mb-4">{member.image}</div>
                <h3 className="font-semibold text-[var(--deep-navy)]">{member.name}</h3>
                <p className="text-sm text-[var(--warm-gray)]">{member.role}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-[var(--leica-orange)] to-[var(--leica-gold)] rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Ready to Start Your Journey?</h2>
          <p className="text-white/90 mb-6 max-w-2xl mx-auto">
            Join thousands of students who have found their path to success in Korea.
          </p>
          <Link href="/schools">
            <Button variant="primary" size="lg" className="bg-white text-[var(--leica-orange)] hover:bg-white/90">
              Browse Schools
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </Link>
        </section>
      </main>

      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
