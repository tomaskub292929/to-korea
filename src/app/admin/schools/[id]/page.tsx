'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout';
import { SchoolForm } from '@/components/admin/forms';
import { getSchoolById } from '@/lib/services/schoolService';
import { School } from '@/lib/types';
import { AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function EditSchoolPage() {
  const params = useParams();
  const id = params.id as string;

  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchSchool() {
      try {
        const data = await getSchoolById(id);
        setSchool(data);
        if (!data) {
          setError('School not found');
        }
      } catch (err) {
        console.error('Error fetching school:', err);
        setError('Failed to load school');
      } finally {
        setLoading(false);
      }
    }

    fetchSchool();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout title="Loading..." subtitle="Please wait">
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[var(--md-primary)] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </AdminLayout>
    );
  }

  if (error || !school) {
    return (
      <AdminLayout title="School Not Found" subtitle="">
        <div className="flex flex-col items-center justify-center h-64">
          <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
          <p className="text-gray-500 mb-4">{error || 'The requested school could not be found.'}</p>
          <Link href="/admin/schools" className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200">
            Back to Schools
          </Link>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${school.name}`} subtitle="Modify school information">
      <SchoolForm
        isEdit
        initialData={{
          id: school.id,
          name: school.name,
          nameRu: school.nameRu,
          nameDe: school.nameDe,
          country: school.country,
          city: school.city,
          websiteUrl: school.websiteUrl || '',
          description: school.description,
          descriptionRu: school.descriptionRu,
          descriptionDe: school.descriptionDe,
          programs: school.programs,
          jobOpportunityLevel: school.jobOpportunityLevel,
          studentCount: school.studentCount,
          rating: school.rating,
          headerImageUrl: school.headerImageUrl,
          logoUrl: school.logoUrl,
          oneLineFeedback: school.oneLineFeedback,
        }}
      />
    </AdminLayout>
  );
}
