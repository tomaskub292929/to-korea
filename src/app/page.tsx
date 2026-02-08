'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { HeroSection } from '@/components/home/HeroSection';
import { StatsSection } from '@/components/home/StatsSection';
import { SchoolFilter } from '@/components/school/SchoolFilter';
import { SchoolGrid } from '@/components/school/SchoolGrid';
import { subscribeToSchools } from '@/lib/services/schoolService';
import { School } from '@/lib/types';
import { mockSchools, filterSchools } from '@/data/schools';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [allSchools, setAllSchools] = useState<School[]>([]);

  // Calculate stats dynamically
  const stats = {
    totalSchools: allSchools.length,
    totalStudents: allSchools.reduce((acc, school) => acc + (school.studentCount || 0), 0),
    programsCount: new Set(allSchools.flatMap(s => s.programs || [])).size,
  };

  // Subscribe to real-time updates
  useEffect(() => {
    const unsubscribe = subscribeToSchools((schools) => {
      setAllSchools(schools);
      setFilteredSchools(schools);
    });
    return () => unsubscribe();
  }, []);

  const handleFilterChange = useCallback((filters: {
    search: string;
    region: string;
    programs: string[];
    jobOpportunityLevel: string[];
    minRating: number;
  }) => {
    const result = filterSchools(allSchools, {
      search: filters.search,
      region: filters.region || undefined,
      programs: filters.programs.length > 0 ? filters.programs : undefined,
      jobOpportunityLevel: filters.jobOpportunityLevel.length > 0 ? filters.jobOpportunityLevel : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
    });
    setFilteredSchools(result);
  }, [allSchools]);

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <HeroSection />

      {/* Stats Section */}
      <StatsSection stats={stats} />

      {/* Schools Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mb-4">
              Explore Korean Universities
            </h2>
            <p className="text-lg text-[var(--warm-gray)] max-w-2xl mx-auto">
              Find the perfect school for your academic and career goals
            </p>
          </div>

          {/* Filter */}
          <SchoolFilter onFilterChange={handleFilterChange} />

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-[var(--warm-gray)]">
              Showing <span className="font-semibold text-[var(--deep-navy)]">{filteredSchools.length}</span> schools
            </p>
            <div className="flex items-center gap-2">
              <span className="text-sm text-[var(--warm-gray)]">Sort by:</span>
              <select className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:border-[var(--leica-orange)]">
                <option value="rating">Rating</option>
                <option value="students">Students</option>
                <option value="name">Name</option>
              </select>
            </div>
          </div>

          {/* School Grid */}
          <SchoolGrid schools={filteredSchools.slice(0, 6)} />

          {/* View All Button */}
          {filteredSchools.length > 6 && (
            <div className="text-center mt-10">
              <Link href="/schools">
                <Button variant="secondary" size="lg" className="group">
                  View All Schools
                  <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-[var(--leica-orange)] to-[var(--leica-gold)]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have found their path to success in Korea.
            Create your free account and explore opportunities today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register">
              <Button
                variant="primary"
                size="lg"
                className="bg-white text-[var(--leica-orange)] hover:bg-white/90"
              >
                Get Started Free
              </Button>
            </Link>
            <Link href="/schools">
              <Button
                variant="secondary"
                size="lg"
                className="border-white text-white hover:bg-white/10"
              >
                Browse Schools
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[var(--deep-navy)] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 rounded-full bg-[var(--leica-orange)] flex items-center justify-center">
                  <span className="text-white font-bold text-lg">G</span>
                </div>
                <span className="font-semibold text-lg">Gateway to Korea</span>
              </div>
              <p className="text-white/60 text-sm max-w-md">
                Connecting international students with educational and career
                opportunities in South Korea since 2024.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/schools" className="hover:text-white">Browse Schools</Link></li>
                <li><Link href="/about" className="hover:text-white">About Us</Link></li>
                <li><Link href="/faq" className="hover:text-white">FAQ</Link></li>
                <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-white/60">
                <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><a href="mailto:support@gatewaytokorea.com" className="hover:text-white">support@gatewaytokorea.com</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/40">
            © 2026 Gateway to Korea. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
