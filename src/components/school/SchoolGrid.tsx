'use client';

import { School } from '@/lib/types';
import { SchoolCard } from './SchoolCard';

interface SchoolGridProps {
  schools: School[];
  isLoading?: boolean;
}

export function SchoolGrid({ schools, isLoading = false }: SchoolGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="bg-[var(--off-white)] rounded-lg border border-[var(--leica-gold)] h-[420px] animate-pulse"
          >
            <div className="h-40 bg-gray-200 rounded-t-lg" />
            <div className="p-4 space-y-3">
              <div className="h-6 bg-gray-200 rounded w-3/4" />
              <div className="h-4 bg-gray-200 rounded w-1/2" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-8 bg-gray-200 rounded w-1/3" />
              <div className="h-4 bg-gray-200 rounded w-full" />
              <div className="flex gap-3 pt-2">
                <div className="h-9 bg-gray-200 rounded flex-1" />
                <div className="h-9 bg-gray-200 rounded flex-1" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🔍</div>
        <h3 className="text-xl font-semibold text-[var(--deep-navy)] mb-2">
          No schools found
        </h3>
        <p className="text-[var(--warm-gray)]">
          Try adjusting your filters or search criteria
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {schools.map((school) => (
        <SchoolCard key={school.id} school={school} />
      ))}
    </div>
  );
}
