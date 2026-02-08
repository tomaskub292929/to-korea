'use client';

import { Button } from '@/components/ui/Button';
import { ArrowRight, GraduationCap, Briefcase, Globe } from 'lucide-react';
import Link from 'next/link';

export function HeroSection() {
  return (
    <section className="relative bg-gradient-to-br from-[var(--deep-navy)] to-[#2D2D4A] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--leica-orange)] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--leica-gold)] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left: Content */}
          <div className="space-y-8">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full">
              <span className="w-2 h-2 bg-[var(--success)] rounded-full animate-pulse" />
              <span className="text-white/90 text-sm">
                Trusted by 10,000+ students worldwide
              </span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Your Gateway to{' '}
              <span className="text-[var(--leica-orange)]">Education & Careers</span>{' '}
              in Korea
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-white/80 max-w-lg">
              Discover top universities and job opportunities in South Korea.
              Connect with verified schools and start your journey today.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/schools">
                <Button variant="primary" size="lg" className="group w-full sm:w-auto">
                  Browse Schools
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/about">
                <Button variant="secondary" size="lg" className="w-full sm:w-auto bg-white/10 border-white/30 text-white hover:bg-white/20">
                  Learn More
                </Button>
              </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
              <div>
                <div className="text-3xl font-bold text-[var(--leica-orange)]">50+</div>
                <div className="text-white/60 text-sm">Partner Schools</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--leica-orange)]">10K+</div>
                <div className="text-white/60 text-sm">Students</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-[var(--leica-orange)]">95%</div>
                <div className="text-white/60 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right: Feature Cards */}
          <div className="hidden md:grid grid-cols-2 gap-4">
            {/* Card 1 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-[var(--leica-orange)] rounded-xl flex items-center justify-center mb-4">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Quality Education</h3>
              <p className="text-white/60 text-sm">
                Access top-ranked universities with world-class facilities
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors mt-8">
              <div className="w-12 h-12 bg-[var(--leica-gold)] rounded-xl flex items-center justify-center mb-4">
                <Briefcase className="w-6 h-6 text-[var(--deep-navy)]" />
              </div>
              <h3 className="text-white font-semibold mb-2">Career Support</h3>
              <p className="text-white/60 text-sm">
                Get connected with leading Korean companies
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:bg-white/15 transition-colors">
              <div className="w-12 h-12 bg-[var(--success)] rounded-xl flex items-center justify-center mb-4">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-white font-semibold mb-2">Global Community</h3>
              <p className="text-white/60 text-sm">
                Join students from Europe, Russia & Central Asia
              </p>
            </div>

            {/* Card 4 - Testimonial Preview */}
            <div className="bg-[var(--leica-orange)]/20 backdrop-blur-sm rounded-2xl p-6 border border-[var(--leica-orange)]/30 mt-8">
              <div className="text-white/90 text-sm italic mb-4">
                "Gateway to Korea helped me find my dream university and now I'm working at Samsung!"
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-full" />
                <div>
                  <div className="text-white font-medium text-sm">Maria K.</div>
                  <div className="text-white/60 text-xs">Germany → Seoul</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg
          viewBox="0 0 1440 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z"
            fill="var(--off-white)"
          />
        </svg>
      </div>
    </section>
  );
}
