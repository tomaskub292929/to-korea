'use client';

import { AdminLayout } from '@/components/admin/layout';
import { SchoolForm } from '@/components/admin/forms';

export default function NewSchoolPage() {
  return (
    <AdminLayout title="Add New School" subtitle="Register a new educational institution">
      <SchoolForm />
    </AdminLayout>
  );
}
