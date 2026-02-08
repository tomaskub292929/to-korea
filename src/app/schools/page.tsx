'use client';

import { useState, useCallback } from 'react';
import { Header } from '@/components/layout/Header';
import { SchoolFilter } from '@/components/school/SchoolFilter';
import { SchoolGrid } from '@/components/school/SchoolGrid';
import { mockSchools, filterSchools } from '@/data/schools';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default function SchoolsPage() {
  const [filteredSchools, setFilteredSchools] = useState(mockSchools);

  const handleFilterChange = useCallback((filters: {
    search: string;
    region: string;
    programs: string[];
    jobOpportunityLevel: string[];
    minRating: number;
  }) => {
    const result = filterSchools(mockSchools, {
      search: filters.search,
      region: filters.region || undefined,
      programs: filters.programs.length > 0 ? filters.programs : undefined,
      jobOpportunityLevel: filters.jobOpportunityLevel.length > 0 ? filters.jobOpportunityLevel : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
    });
    setFilteredSchools(result);
  }, []);

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center text-[var(--warm-gray)] hover:text-[var(--leica-orange)] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mb-2">
            Browse All Schools
          </h1>
          <p className="text-lg text-[var(--warm-gray)]">
            Explore {mockSchools.length} verified Korean universities and institutions
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

        {/* School Grid - Show All */}
        <SchoolGrid schools={filteredSchools} />
      </main>

      {/* Simple Footer */}
      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 Gateway to Korea. All rights reserved.</p>
      </footer>
    </div>
  );
}
