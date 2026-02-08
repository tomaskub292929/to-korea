'use client';

import { useParams } from 'next/navigation';
import { AdminLayout } from '@/components/admin/layout';
import { SchoolForm } from '@/components/admin/forms';
import { mockSchools } from '@/data/schools';

export default function EditSchoolPage() {
  const params = useParams();
  const id = params.id as string;

  // Find school data
  const school = mockSchools.find((s) => s.id === id);

  if (!school) {
    return (
      <AdminLayout title="School Not Found" subtitle="">
        <div className="text-center py-12">
          <p className="text-gray-500">The requested school could not be found.</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout title={`Edit: ${school.name}`} subtitle="Modify school information">
      <SchoolForm
        isEdit
        initialData={{
          name: school.name,
          country: school.country,
          city: school.city,
          websiteUrl: school.websiteUrl || '',
          description: school.description,
          programs: school.programs,
          jobOpportunityLevel: school.jobOpportunityLevel,
          studentCount: school.studentCount,
        }}
      />
    </AdminLayout>
  );
}
