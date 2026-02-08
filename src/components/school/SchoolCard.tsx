'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Users, Briefcase } from 'lucide-react';
import { School } from '@/lib/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { formatRating, formatStudentCount, truncateText } from '@/lib/utils';

interface SchoolCardProps {
  school: School;
}

export function SchoolCard({ school }: SchoolCardProps) {
  const jobBadgeVariant =
    school.jobOpportunityLevel === 'high'
      ? 'high'
      : school.jobOpportunityLevel === 'medium'
      ? 'medium'
      : 'low';

  const jobLabel =
    school.jobOpportunityLevel === 'high'
      ? 'High Opportunity'
      : school.jobOpportunityLevel === 'medium'
      ? 'Medium Opportunity'
      : 'Low Opportunity';

  return (
    <div className="group relative bg-[var(--off-white)] rounded-lg border border-[var(--leica-gold)] border-l-4 border-l-[var(--leica-orange)] shadow-[0_2px_8px_rgba(0,0,0,0.08)] transition-all duration-300 ease-in-out hover:scale-[1.02] hover:bg-[var(--light-cream)] hover:border-l-[6px] hover:shadow-[0_4px_12px_rgba(0,0,0,0.15)] overflow-hidden">
      {/* Image Section */}
      <div className="relative w-full h-40 overflow-hidden">
        <Image
          src={school.headerImageUrl || '/images/placeholder-school.jpg'}
          alt={school.name}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* School Name */}
        <h3 className="text-lg font-semibold text-[var(--deep-navy)] line-clamp-1">
          🎓 {school.name}
        </h3>

        {/* Location & Program */}
        <div className="flex items-center gap-2 text-sm text-[var(--warm-gray)]">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span className="line-clamp-1">
            {school.city} | {school.programs.slice(0, 2).join(', ')}
            {school.programs.length > 2 && '...'}
          </span>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            {/* Rating */}
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-[var(--leica-orange)] fill-current" />
              <span className="font-medium text-[var(--deep-navy)]">
                {formatRating(school.rating)}/5
              </span>
            </div>
            {/* Student Count */}
            <div className="flex items-center gap-1 text-[var(--warm-gray)]">
              <Users className="w-4 h-4" />
              <span>{formatStudentCount(school.studentCount)}</span>
            </div>
          </div>
        </div>

        {/* Job Opportunity Badge */}
        <div className="flex items-center gap-2">
          <Briefcase className="w-4 h-4 text-[var(--warm-gray)]" />
          <Badge variant={jobBadgeVariant}>{jobLabel}</Badge>
        </div>

        {/* One-line Feedback */}
        {school.oneLineFeedback && (
          <p className="text-sm italic text-[var(--warm-gray)] line-clamp-2">
            {truncateText(school.oneLineFeedback, 80)}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-2">
          <Button variant="primary" size="sm" className="flex-1">
            Apply
          </Button>
          <Link href={`/schools/${school.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
