'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getAllPrograms, getAllRegions } from '@/data/schools';
import { cn } from '@/lib/utils';

interface FilterState {
  search: string;
  region: string;
  programs: string[];
  jobOpportunityLevel: string[];
  minRating: number;
}

interface SchoolFilterProps {
  onFilterChange: (filters: FilterState) => void;
}

export function SchoolFilter({ onFilterChange }: SchoolFilterProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    region: '',
    programs: [],
    jobOpportunityLevel: [],
    minRating: 0,
  });

  const regions = getAllRegions();
  const programs = getAllPrograms();
  const jobLevels = [
    { value: 'high', label: 'High' },
    { value: 'medium', label: 'Medium' },
    { value: 'low', label: 'Low' },
  ];

  // Notify parent of filter changes
  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  // Update a single filter
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Toggle array filter (programs, jobOpportunityLevel)
  const toggleArrayFilter = (
    key: 'programs' | 'jobOpportunityLevel',
    value: string
  ) => {
    setFilters((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({
      search: '',
      region: '',
      programs: [],
      jobOpportunityLevel: [],
      minRating: 0,
    });
  };

  // Count active filters
  const activeFilterCount =
    (filters.region ? 1 : 0) +
    filters.programs.length +
    filters.jobOpportunityLevel.length +
    (filters.minRating > 0 ? 1 : 0);

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-8">
      {/* Search Row */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <Input
            icon="search"
            placeholder="Search schools, cities, or programs..."
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        {/* Region Dropdown */}
        <select
          value={filters.region}
          onChange={(e) => updateFilter('region', e.target.value)}
          className="h-11 px-4 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded text-[var(--deep-navy)] focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]"
        >
          <option value="">All Regions</option>
          {regions.map((region) => (
            <option key={region.value} value={region.value}>
              {region.label}
            </option>
          ))}
        </select>

        {/* Filter Toggle Button */}
        <Button
          variant="secondary"
          onClick={() => setIsExpanded(!isExpanded)}
          className="relative"
        >
          <Filter className="w-4 h-4 mr-2" />
          Filters
          {activeFilterCount > 0 && (
            <span className="absolute -top-2 -right-2 w-5 h-5 bg-[var(--leica-orange)] text-white text-xs rounded-full flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Expanded Filters */}
      {isExpanded && (
        <div className="mt-4 pt-4 border-t border-gray-200 space-y-4 animate-in slide-in-from-top duration-200">
          {/* Programs */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
              Programs
            </label>
            <div className="flex flex-wrap gap-2">
              {programs.slice(0, 10).map((program) => (
                <button
                  key={program}
                  onClick={() => toggleArrayFilter('programs', program)}
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition-colors',
                    filters.programs.includes(program)
                      ? 'bg-[var(--leica-orange)] text-white border-[var(--leica-orange)]'
                      : 'bg-white text-[var(--deep-navy)] border-gray-300 hover:border-[var(--leica-gold)]'
                  )}
                >
                  {program}
                </button>
              ))}
            </div>
          </div>

          {/* Job Opportunity Level */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
              Job Opportunity
            </label>
            <div className="flex flex-wrap gap-2">
              {jobLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    toggleArrayFilter('jobOpportunityLevel', level.value)
                  }
                  className={cn(
                    'px-3 py-1 rounded-full text-sm border transition-colors',
                    filters.jobOpportunityLevel.includes(level.value)
                      ? 'bg-[var(--leica-orange)] text-white border-[var(--leica-orange)]'
                      : 'bg-white text-[var(--deep-navy)] border-gray-300 hover:border-[var(--leica-gold)]'
                  )}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </div>

          {/* Minimum Rating */}
          <div>
            <label className="block text-sm font-medium text-[var(--deep-navy)] mb-2">
              Minimum Rating: {filters.minRating > 0 ? `${filters.minRating}+` : 'Any'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={filters.minRating}
              onChange={(e) =>
                updateFilter('minRating', parseFloat(e.target.value))
              }
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[var(--leica-orange)]"
            />
          </div>

          {/* Active Filters & Reset */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-sm text-[var(--warm-gray)]">Active:</span>
              {filters.region && (
                <Badge variant="info">
                  {regions.find((r) => r.value === filters.region)?.label}
                  <button
                    onClick={() => updateFilter('region', '')}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              )}
              {filters.programs.map((p) => (
                <Badge key={p} variant="info">
                  {p}
                  <button
                    onClick={() => toggleArrayFilter('programs', p)}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              {filters.jobOpportunityLevel.map((j) => (
                <Badge key={j} variant="info">
                  {j} opportunity
                  <button
                    onClick={() => toggleArrayFilter('jobOpportunityLevel', j)}
                    className="ml-1"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
              <Button variant="text" onClick={resetFilters} className="text-sm">
                Reset All
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
