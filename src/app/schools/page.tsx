'use client';

import { useState, useCallback, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import { SchoolFilter } from '@/components/school/SchoolFilter';
import { SchoolGrid } from '@/components/school/SchoolGrid';
import { BoardSidebar } from '@/components/board';
import { getAllSchools } from '@/lib/services/schoolService';
import { mockSchools } from '@/data/schools';
import { School } from '@/lib/types';
import Link from 'next/link';
import { ArrowLeft, RefreshCw } from 'lucide-react';

// Filter function for schools
function filterSchools(
  schools: School[],
  filters: {
    search?: string;
    region?: string;
    programs?: string[];
    jobOpportunityLevel?: string[];
    minRating?: number;
  }
): School[] {
  return schools.filter(school => {
    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      const matchesSearch =
        school.name.toLowerCase().includes(searchLower) ||
        school.city.toLowerCase().includes(searchLower) ||
        school.programs.some(p => p.toLowerCase().includes(searchLower));
      if (!matchesSearch) return false;
    }

    // Region filter
    if (filters.region && school.region !== filters.region) {
      return false;
    }

    // Programs filter
    if (filters.programs && filters.programs.length > 0) {
      const hasProgram = filters.programs.some(p =>
        school.programs.includes(p)
      );
      if (!hasProgram) return false;
    }

    // Job opportunity filter
    if (filters.jobOpportunityLevel && filters.jobOpportunityLevel.length > 0) {
      if (!filters.jobOpportunityLevel.includes(school.jobOpportunityLevel)) {
        return false;
      }
    }

    // Rating filter
    if (filters.minRating && school.rating < filters.minRating) {
      return false;
    }

    return true;
  });
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchSchools = async () => {
    setLoading(true);
    try {
      const data = await getAllSchools();
      // Use mock data as fallback if Firestore is empty
      const schoolsData = data.length > 0 ? data : mockSchools;
      setSchools(schoolsData);
      setFilteredSchools(schoolsData);
      setError('');
    } catch (err) {
      console.error('Error fetching schools:', err);
      // Use mock data on error
      setSchools(mockSchools);
      setFilteredSchools(mockSchools);
      setError('');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchools();
  }, []);

  const handleFilterChange = useCallback((filters: {
    search: string;
    region: string;
    programs: string[];
    jobOpportunityLevel: string[];
    minRating: number;
  }) => {
    const result = filterSchools(schools, {
      search: filters.search,
      region: filters.region || undefined,
      programs: filters.programs.length > 0 ? filters.programs : undefined,
      jobOpportunityLevel: filters.jobOpportunityLevel.length > 0 ? filters.jobOpportunityLevel : undefined,
      minRating: filters.minRating > 0 ? filters.minRating : undefined,
    });
    setFilteredSchools(result);
  }, [schools]);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mb-2">
              Browse All Schools
            </h1>
            <p className="text-lg text-[var(--warm-gray)]">
              Explore {schools.length} verified Korean universities and institutions
            </p>
          </div>
          <button
            onClick={fetchSchools}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Loading State */}
        {loading && schools.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-[var(--warm-gray)]">Loading schools...</p>
            </div>
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-24">
            <div className="text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={fetchSchools}
                className="px-4 py-2 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]"
              >
                Try Again
              </button>
            </div>
          </div>
        ) : (
          /* Main Layout: Sidebar + Content */
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Left Sidebar - Board */}
            <aside className="lg:w-72 flex-shrink-0">
              <div className="lg:sticky lg:top-4">
                <BoardSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
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
              {filteredSchools.length === 0 ? (
                <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No schools found</p>
                </div>
              ) : (
                <SchoolGrid schools={filteredSchools} />
              )}
            </div>
          </div>
        )}
      </main>

      {/* Simple Footer */}
      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 InBeam Test. All rights reserved.</p>
      </footer>
    </div>
  );
}
