'use client';

import { useState, FormEvent } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';
import { createSchool, updateSchool } from '@/lib/services/schoolService';
import { School } from '@/lib/types';

interface SchoolFormProps {
  initialData?: {
    name: string;
    nameRu?: string;
    nameDe?: string;
    country: string;
    city: string;
    websiteUrl: string;
    description: string;
    descriptionRu?: string;
    descriptionDe?: string;
    programs: string[];
    jobOpportunityLevel: string;
    studentCount: number;
    tuitionFee?: number;
    applicationDeadline?: string;
    semesterStart?: string;
  };
  isEdit?: boolean;
}

const availablePrograms = [
  'Medicine', 'Engineering', 'Business', 'Computer Science', 'Law',
  'Nursing', 'International Studies', 'AI', 'Robotics', 'Physics',
  'Chemistry', 'Materials Science', 'Architecture', 'Art', 'Music',
  'Pharmacy', 'Dentistry', 'Hospitality', 'Korean Studies', 'Film Studies',
];

export function SchoolForm({ initialData, isEdit = false }: SchoolFormProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'en' | 'ru' | 'de'>('en');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    initialData?.programs || []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const toggleProgram = (program: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(program)
        ? prev.filter((p) => p !== program)
        : [...prev, program]
    );
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData(e.currentTarget);

      // Helper function to get value or undefined (not empty string)
      const getValue = (key: string): string | undefined => {
        const value = formData.get(key) as string;
        return value && value.trim() !== '' ? value : undefined;
      };

      const getNumberValue = (key: string): number | undefined => {
        const value = formData.get(key) as string;
        const num = parseInt(value);
        return !isNaN(num) && num > 0 ? num : undefined;
      };

      // Build school data object, only including defined values
      const schoolData: any = {
        name: getValue('name')!,
        country: getValue('country')!,
        city: getValue('city')!,
        websiteUrl: getValue('websiteUrl')!,
        description: getValue('description')!,
        programs: selectedPrograms,
        jobOpportunityLevel: getValue('jobOpportunityLevel') as 'high' | 'medium' | 'low',
        studentCount: getNumberValue('studentCount') || 0,
        rating: 4.5,
        logoUrl: '/images/schools/default-logo.png',
        headerImageUrl: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
        region: 'western-europe',
        oneLineFeedback: '',
      };

      // Only add optional fields if they have values
      const nameRu = getValue('nameRu');
      if (nameRu) schoolData.nameRu = nameRu;

      const nameDe = getValue('nameDe');
      if (nameDe) schoolData.nameDe = nameDe;

      const descriptionRu = getValue('descriptionRu');
      if (descriptionRu) schoolData.descriptionRu = descriptionRu;

      const descriptionDe = getValue('descriptionDe');
      if (descriptionDe) schoolData.descriptionDe = descriptionDe;

      const tuitionFee = getNumberValue('tuitionFee');
      if (tuitionFee) schoolData.tuitionFee = tuitionFee;

      const applicationDeadline = getValue('applicationDeadline');
      if (applicationDeadline) schoolData.applicationDeadline = applicationDeadline;

      if (isEdit && initialData) {
        // Update existing school
        const schoolId = (initialData as any).id;
        await updateSchool(schoolId, schoolData);
        alert('✅ School updated successfully!');
      } else {
        // Create new school
        await createSchool(schoolData);
        alert('✅ School created successfully!');
      }

      router.push('/admin/schools');
      router.refresh();
    } catch (err) {
      console.error('Error saving school:', err);
      setError('Failed to save school. Please try again.');
      alert('❌ Error: ' + (err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Back Button */}
      <Link
        href="/admin/schools"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Schools
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Basic Information</h3>

            {/* Language Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'en', label: '🇬🇧 English' },
                { id: 'ru', label: '🇷🇺 Russian' },
                { id: 'de', label: '🇩🇪 German' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as 'en' | 'ru' | 'de')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab.id
                    ? 'bg-[var(--leica-orange)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  School Name {activeTab === 'en' && <span className="text-red-500">*</span>}
                </label>
                <input
                  type="text"
                  name={activeTab === 'en' ? 'name' : activeTab === 'ru' ? 'nameRu' : 'nameDe'}
                  defaultValue={
                    activeTab === 'en'
                      ? initialData?.name
                      : activeTab === 'ru'
                        ? initialData?.nameRu
                        : initialData?.nameDe
                  }
                  placeholder={`School name in ${activeTab.toUpperCase()}`}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
                  required={activeTab === 'en'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description {activeTab === 'en' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={4}
                  name={activeTab === 'en' ? 'description' : activeTab === 'ru' ? 'descriptionRu' : 'descriptionDe'}
                  defaultValue={
                    activeTab === 'en'
                      ? initialData?.description
                      : activeTab === 'ru'
                        ? initialData?.descriptionRu
                        : initialData?.descriptionDe
                  }
                  placeholder={`Description in ${activeTab.toUpperCase()} (300-500 characters recommended)`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)] resize-none"
                  required={activeTab === 'en'}
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Location</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country <span className="text-red-500">*</span>
                </label>
                <select
                  name="country"
                  defaultValue={initialData?.country || 'South Korea'}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="South Korea">South Korea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  name="city"
                  defaultValue={initialData?.city}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  required
                >
                  <option value="">Select city</option>
                  <option value="Seoul">Seoul</option>
                  <option value="Busan">Busan</option>
                  <option value="Daejeon">Daejeon</option>
                  <option value="Incheon">Incheon</option>
                  <option value="Pohang">Pohang</option>
                  <option value="Daegu">Daegu</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Website URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  name="websiteUrl"
                  defaultValue={initialData?.websiteUrl}
                  placeholder="https://www.example.ac.kr"
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                  required
                />
              </div>
            </div>
          </div>

          {/* Programs */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Programs Offered</h3>
            <div className="flex flex-wrap gap-2">
              {availablePrograms.map((program) => (
                <button
                  key={program}
                  onClick={() => toggleProgram(program)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedPrograms.includes(program)
                    ? 'bg-[var(--leica-orange)] text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                >
                  {program}
                </button>
              ))}
            </div>
          </div>

          {/* Additional Info */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Opportunity Level
                </label>
                <select
                  name="jobOpportunityLevel"
                  defaultValue={initialData?.jobOpportunityLevel || 'medium'}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                >
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Student Count
                </label>
                <input
                  type="number"
                  name="studentCount"
                  defaultValue={initialData?.studentCount}
                  placeholder="e.g., 25000"
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Annual Tuition (USD)
                </label>
                <input
                  type="number"
                  name="tuitionFee"
                  defaultValue={initialData?.tuitionFee}
                  placeholder="e.g., 5000"
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Application Deadline
                </label>
                <input
                  type="date"
                  name="applicationDeadline"
                  defaultValue={initialData?.applicationDeadline}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Images</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Logo (200x200px)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[var(--leica-orange)] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Header Image (1200x400px)
                </label>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 text-center hover:border-[var(--leica-orange)] transition-colors cursor-pointer">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Click to upload</p>
                </div>
              </div>
            </div>
          </div>

          {/* Status */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="radio" name="status" value="draft" className="w-4 h-4" />
                <div>
                  <p className="font-medium">Draft</p>
                  <p className="text-xs text-gray-500">Save but don't publish</p>
                </div>
              </label>
              <label className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg cursor-pointer">
                <input type="radio" name="status" value="published" defaultChecked className="w-4 h-4" />
                <div>
                  <p className="font-medium">Published</p>
                  <p className="text-xs text-gray-500">Visible to all users</p>
                </div>
              </label>
            </div>
          </div>

          {/* Actions */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <div className="space-y-3">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full flex items-center justify-center gap-2 h-10 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save className="w-4 h-4" />
                {isSubmitting ? 'Saving...' : (isEdit ? 'Update School' : 'Create School')}
              </button>
              <Link
                href="/admin/schools"
                className="w-full flex items-center justify-center gap-2 h-10 border border-gray-200 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
