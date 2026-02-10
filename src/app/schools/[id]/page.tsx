'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { getSchoolById } from '@/lib/services/schoolService';
import { School } from '@/lib/types';
import { formatRating, formatStudentCount } from '@/lib/utils';
import {
  ArrowLeft,
  MapPin,
  Star,
  Users,
  Briefcase,
  Globe,
  GraduationCap,
  Building2,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { SchoolReviews } from '@/components/school/SchoolReviews';

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolId = params.id as string;

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSchool() {
      try {
        const data = await getSchoolById(schoolId);
        if (!data) {
          setError('School not found');
        } else {
          setSchool(data);
        }
      } catch (err) {
        console.error('Error fetching school:', err);
        setError('Failed to load school');
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [schoolId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <div className="flex items-center justify-center py-24">
          <div className="text-center">
            <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--warm-gray)]">Loading school...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !school) {
    return (
      <div className="min-h-screen bg-[var(--off-white)]">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h1 className="text-2xl font-bold text-[var(--deep-navy)] mb-4">School Not Found</h1>
          <p className="text-[var(--warm-gray)] mb-8">{error || "The school you're looking for doesn't exist."}</p>
          <Link href="/schools">
            <Button variant="primary">Browse All Schools</Button>
          </Link>
        </main>
      </div>
    );
  }

  const jobBadgeVariant = school.jobOpportunityLevel === 'high' ? 'high' : school.jobOpportunityLevel === 'medium' ? 'medium' : 'low';

  return (
    <div className="min-h-screen bg-[var(--off-white)]">
      <Header />

      {/* Hero Image */}
      <div className="relative h-64 md:h-80 lg:h-96 w-full">
        <Image
          src={school.headerImageUrl || '/images/placeholder-school.jpg'}
          alt={school.name}
          fill
          className="object-cover"
          priority
        />
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        {/* Content on hero */}
        <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/schools"
              className="inline-flex items-center text-white/80 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Schools
            </Link>
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-2">
              {school.name}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/90">
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{school.city}, {school.country}</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{formatRating(school.rating)}/5</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4" />
                <span>{formatStudentCount(school.studentCount)} students</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--deep-navy)] mb-4 flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-[var(--leica-orange)]" />
                About
              </h2>
              <p className="text-[var(--warm-gray)] leading-relaxed">
                {school.description}
              </p>
              {school.oneLineFeedback && (
                <blockquote className="mt-4 pl-4 border-l-4 border-[var(--leica-orange)] italic text-[var(--deep-navy)]">
                  {school.oneLineFeedback}
                </blockquote>
              )}
            </section>

            {/* Programs */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--deep-navy)] mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-[var(--leica-orange)]" />
                Programs Offered
              </h2>
              <div className="flex flex-wrap gap-2">
                {school.programs.map((program) => (
                  <span
                    key={program}
                    className="px-4 py-2 bg-[var(--off-white)] rounded-full text-[var(--deep-navy)] border border-gray-200"
                  >
                    {program}
                  </span>
                ))}
              </div>
            </section>

            {/* Career Outcomes */}
            <section className="bg-white rounded-xl p-6 shadow-sm">
              <h2 className="text-2xl font-bold text-[var(--deep-navy)] mb-4 flex items-center gap-2">
                <Briefcase className="w-6 h-6 text-[var(--leica-orange)]" />
                Career Outcomes
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-[var(--off-white)] rounded-lg">
                  <div className="text-sm text-[var(--warm-gray)] mb-1">Job Opportunity Level</div>
                  <Badge variant={jobBadgeVariant} className="text-sm">
                    {school.jobOpportunityLevel === 'high' ? 'High Opportunity' :
                     school.jobOpportunityLevel === 'medium' ? 'Medium Opportunity' : 'Low Opportunity'}
                  </Badge>
                </div>
                <div className="p-4 bg-[var(--off-white)] rounded-lg">
                  <div className="text-sm text-[var(--warm-gray)] mb-1">Employment Rate</div>
                  <div className="text-2xl font-bold text-[var(--leica-orange)]">
                    {school.jobOpportunityLevel === 'high' ? '92%' :
                     school.jobOpportunityLevel === 'medium' ? '78%' : '65%'}
                  </div>
                </div>
              </div>
            </section>

            {/* Reviews Section */}
            <SchoolReviews schoolId={school.id} schoolName={school.name} />
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Apply Card */}
            <div className="bg-white rounded-xl p-6 shadow-sm border-2 border-[var(--leica-orange)]">
              <h3 className="text-xl font-bold text-[var(--deep-navy)] mb-4">Ready to Apply?</h3>
              <p className="text-[var(--warm-gray)] text-sm mb-6">
                Start your journey to {school.name} today.
              </p>
              <Link href={`/apply/${school.id}`}>
                <Button variant="primary" className="w-full mb-3">
                  Apply Now
                </Button>
              </Link>
              {school.websiteUrl && (
                <a
                  href={school.websiteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 text-[var(--leica-orange)] hover:underline"
                >
                  <Globe className="w-4 h-4" />
                  Visit Official Website
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>

            {/* Quick Facts */}
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="text-lg font-bold text-[var(--deep-navy)] mb-4">Quick Facts</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--leica-orange)]/10 rounded-lg flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-[var(--leica-orange)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--warm-gray)]">Location</div>
                    <div className="font-medium text-[var(--deep-navy)]">{school.city}, {school.country}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--leica-orange)]/10 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-[var(--leica-orange)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--warm-gray)]">Students</div>
                    <div className="font-medium text-[var(--deep-navy)]">{formatStudentCount(school.studentCount)}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--leica-orange)]/10 rounded-lg flex items-center justify-center">
                    <Star className="w-5 h-5 text-[var(--leica-orange)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--warm-gray)]">Rating</div>
                    <div className="font-medium text-[var(--deep-navy)]">{formatRating(school.rating)} / 5.0</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[var(--leica-orange)]/10 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[var(--leica-orange)]" />
                  </div>
                  <div>
                    <div className="text-sm text-[var(--warm-gray)]">Application Deadline</div>
                    <div className="font-medium text-[var(--deep-navy)]">March 31, 2026</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[var(--deep-navy)] text-white/60 text-center py-6 mt-16">
        <p>© 2026 InBeam Test. All rights reserved.</p>
      </footer>
    </div>
  );
}
