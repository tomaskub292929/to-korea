'use client';

import { useState, useEffect } from 'react';
import { ArrowRight, MapPin, Star, Users } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { SchoolSearch } from './SchoolSearch';
import { School } from '@/lib/types';
import { useLanguage } from '@/lib/i18n/LanguageContext';

export interface HeroSectionProps {
  schools: School[];
  loading?: boolean;
}

export function HeroSection({ schools, loading = false }: HeroSectionProps) {
  const { t } = useLanguage();

  // Show first 6 schools
  const featuredSchools = schools.slice(0, 6);

  return (
    <section className="relative bg-gradient-to-br from-[var(--md-primary)] to-[var(--md-tertiary)] overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[var(--md-primary-container)] rounded-full blur-[100px]" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[var(--md-tertiary-container)] rounded-full blur-[120px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Hero Content - Centered */}
        <div className="text-center space-y-5 max-w-3xl mx-auto mb-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-sm px-4 py-2 rounded-full">
            <span className="w-2 h-2 bg-[#4CAF50] rounded-full animate-pulse" />
            <span className="text-white/90 text-sm font-medium">
              {t('hero.badge')}
            </span>
          </div>

          {/* Heading - Fixed Typography */}
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white leading-tight whitespace-normal" style={{ wordBreak: 'keep-all' }}>
            <span className="text-[var(--md-primary-container)]">InBeam Test</span>
            <br />
            <span>{t('hero.titleLine2')}</span>
          </h1>

          {/* Subheading */}
          <p className="text-base md:text-lg text-white/80 max-w-xl mx-auto">
            {t('hero.subtitle')}
          </p>

          {/* Search Bar */}
          <div className="pt-2">
            <SchoolSearch schools={schools} />
          </div>
        </div>

        {/* School List Grid */}
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">{t('hero.schoolsTitle')}</h2>
            <Link
              href="/schools"
              className="text-white/80 hover:text-white text-sm font-medium flex items-center gap-1 transition-colors"
            >
              {t('hero.viewAll')}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-white/20 rounded-2xl h-72 animate-pulse" />
              ))
            ) : featuredSchools.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-white/80">{t('hero.noSchools') || 'No schools available yet. Check back soon!'}</p>
              </div>
            ) : (
              featuredSchools.map((school) => (
                <Link
                  key={school.id}
                  href={`/schools/${school.id}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] group"
                >
                  {/* School Image */}
                  <div className="relative h-40 w-full">
                    <Image
                      src={school.headerImageUrl || '/images/placeholder-school.jpg'}
                      alt={school.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                    {/* Rating Badge */}
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="text-sm font-medium text-gray-800">{school.rating}</span>
                    </div>

                    {/* School Name on Image */}
                    <div className="absolute bottom-3 left-3 right-3">
                      <h3 className="text-lg font-semibold text-white truncate">
                        {school.name}
                      </h3>
                      <div className="flex items-center gap-1 text-white/80">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">{school.city}</span>
                      </div>
                    </div>
                  </div>

                  {/* School Info */}
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-1 text-gray-600">
                        <Users className="w-4 h-4" />
                        <span className="text-sm">{school.studentCount.toLocaleString()}{t('hero.students')}</span>
                      </div>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${school.jobOpportunityLevel === 'high'
                        ? 'bg-green-100 text-green-700'
                        : school.jobOpportunityLevel === 'medium'
                          ? 'bg-yellow-100 text-yellow-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {school.jobOpportunityLevel === 'high' ? '취업률 높음' :
                          school.jobOpportunityLevel === 'medium' ? '취업률 보통' : '취업률'}
                      </span>
                    </div>

                    {/* Programs */}
                    <div className="flex flex-wrap gap-1.5">
                      {school.programs.slice(0, 3).map((program) => (
                        <span
                          key={program}
                          className="px-2 py-1 bg-[var(--md-secondary-container)] text-[var(--md-on-secondary-container)] rounded-full text-xs font-medium"
                        >
                          {program}
                        </span>
                      ))}
                      {school.programs.length > 3 && (
                        <span className="text-xs text-gray-500 px-1 py-1">
                          +{school.programs.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>

          {/* View All Button */}
          <div className="text-center mt-8">
            <Link
              href="/schools"
              className="inline-flex items-center justify-center h-12 px-8 bg-white text-[var(--md-primary)] font-semibold rounded-full hover:bg-white/90 transition-colors group"
            >
              {t('hero.viewAllSchools')}
              <ArrowRight className="ml-2 w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-4 md:gap-6 mt-12 pt-8 border-t border-white/20">
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-[var(--md-primary-container)]">50+</div>
            <div className="text-white/70 text-xs md:text-sm font-medium mt-1">{t('hero.partnerSchools')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-[var(--md-primary-container)]">10K+</div>
            <div className="text-white/70 text-xs md:text-sm font-medium mt-1">{t('hero.registeredStudents')}</div>
          </div>
          <div className="text-center">
            <div className="text-2xl md:text-4xl font-bold text-[var(--md-primary-container)]">95%</div>
            <div className="text-white/70 text-xs md:text-sm font-medium mt-1">{t('hero.acceptanceRate')}</div>
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
            fill="var(--md-surface)"
          />
        </svg>
      </div>
    </section>
  );
}
