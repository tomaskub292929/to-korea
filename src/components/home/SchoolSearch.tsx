'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown, MapPin, Star, GraduationCap } from 'lucide-react';
import Link from 'next/link';
import type { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface SchoolSearchProps {
  schools: School[];
}

export function SchoolSearch({ schools }: SchoolSearchProps) {
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter schools based on search query
  const filteredSchools = schools.filter((school) =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.programs.some(p => p.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full max-w-2xl mx-auto">
      {/* Search Input */}
      <div
        className="relative bg-[var(--md-surface)] rounded-[var(--md-radius-full)] md-elevation-2 overflow-hidden"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center">
          <div className="pl-5 pr-3">
            <Search className="w-5 h-5 text-[var(--md-on-surface-variant)]" />
          </div>
          <input
            type="text"
            placeholder={t('search.placeholder')}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            className="flex-1 py-4 pr-4 bg-transparent text-[var(--md-on-surface)] md-body-large placeholder:text-[var(--md-on-surface-variant)] focus:outline-none"
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(!isOpen);
            }}
            className="px-4 py-4 text-[var(--md-on-surface-variant)] hover:text-[var(--md-on-surface)] transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[var(--md-surface)] rounded-[var(--md-radius-lg)] md-elevation-3 overflow-hidden z-50 max-h-[400px] overflow-y-auto">
          {/* Header */}
          <div className="px-4 py-3 bg-[var(--md-surface-variant)] border-b border-[var(--md-outline-variant)]">
            <div className="flex items-center justify-between">
              <span className="md-label-large text-[var(--md-on-surface-variant)]">
                {filteredSchools.length}{t('search.found')}
              </span>
              <Link
                href="/schools"
                className="md-label-large text-[var(--md-primary)] hover:underline"
              >
                {t('search.viewAll')}
              </Link>
            </div>
          </div>

          {/* School List */}
          <div className="py-2">
            {filteredSchools.length > 0 ? (
              filteredSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.id}`}
                  className="flex items-center gap-4 px-4 py-3 hover:bg-[var(--md-surface-variant)] transition-colors"
                  onClick={() => setIsOpen(false)}
                >
                  {/* Logo */}
                  <div className="w-12 h-12 bg-[var(--md-primary-container)] rounded-[var(--md-radius-md)] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-6 h-6 text-[var(--md-on-primary-container)]" />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="md-title-medium text-[var(--md-on-surface)] truncate">
                      {school.name}
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <div className="flex items-center gap-1 text-[var(--md-on-surface-variant)]">
                        <MapPin className="w-4 h-4" />
                        <span className="md-body-small">{school.city}</span>
                      </div>
                      <div className="flex items-center gap-1 text-[var(--md-on-surface-variant)]">
                        <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                        <span className="md-body-small">{school.rating}</span>
                      </div>
                    </div>
                  </div>

                  {/* Programs Badge */}
                  <div className="hidden sm:flex items-center gap-1 flex-wrap justify-end max-w-[150px]">
                    {school.programs.slice(0, 2).map((program) => (
                      <span
                        key={program}
                        className="px-2 py-1 bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] rounded-[var(--md-radius-full)] md-label-small whitespace-nowrap"
                      >
                        {program}
                      </span>
                    ))}
                    {school.programs.length > 2 && (
                      <span className="md-label-small text-[var(--md-on-surface-variant)]">
                        +{school.programs.length - 2}
                      </span>
                    )}
                  </div>
                </Link>
              ))
            ) : (
              <div className="px-4 py-8 text-center">
                <GraduationCap className="w-12 h-12 mx-auto text-[var(--md-on-surface-variant)] opacity-50 mb-3" />
                <p className="md-body-large text-[var(--md-on-surface-variant)]">
                  {t('search.noResults')}
                </p>
                <p className="md-body-medium text-[var(--md-on-surface-variant)] opacity-70 mt-1">
                  {t('search.tryDifferent')}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-[var(--md-surface-variant)] border-t border-[var(--md-outline-variant)]">
            <Link
              href="/schools"
              className="md-btn-filled w-full justify-center"
              onClick={() => setIsOpen(false)}
            >
              {t('search.browseAll')}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
