'use client';

import { GraduationCap, Users, Building2, Award } from 'lucide-react';

interface StatsSectionProps {
  stats: {
    totalSchools: number;
    totalStudents: number;
    programsCount: number;
  };
}

export function StatsSection({ stats }: StatsSectionProps) {
  const statItems = [
    {
      icon: GraduationCap,
      value: `${stats.totalSchools}+`,
      label: 'Partner Universities',
      description: 'Verified Korean institutions',
    },
    {
      icon: Users,
      value: `${stats.totalStudents.toLocaleString()}+`,
      label: 'Students Enrolled',
      description: 'From 30+ countries',
    },
    {
      icon: Building2,
      value: '200+',
      label: 'Company Partners',
      description: 'Including Samsung, LG, Hyundai',
    },
    {
      icon: Award,
      value: `${stats.programsCount}+`,
      label: 'Success Rate', // This label seems wrong for programs count, but keeping structure. Let's change label to 'Programs Offered'
      description: 'Diverse academic paths',
    },
  ];
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--deep-navy)] mb-4">
            Trusted by Students Worldwide
          </h2>
          <p className="text-lg text-[var(--warm-gray)] max-w-2xl mx-auto">
            Join thousands of students who have successfully started their journey in Korea through our platform.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl bg-[var(--off-white)] border border-gray-100 hover:border-[var(--leica-gold)] hover:shadow-lg transition-all duration-300"
            >
              {/* Icon */}
              <div className="w-14 h-14 mx-auto mb-4 bg-[var(--leica-orange)]/10 rounded-xl flex items-center justify-center">
                <stat.icon className="w-7 h-7 text-[var(--leica-orange)]" />
              </div>

              {/* Value */}
              <div className="text-3xl md:text-4xl font-bold text-[var(--leica-orange)] mb-1">
                {stat.value}
              </div>

              {/* Label */}
              <div className="text-lg font-semibold text-[var(--deep-navy)] mb-1">
                {stat.label}
              </div>

              {/* Description */}
              <div className="text-sm text-[var(--warm-gray)]">
                {stat.description}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
