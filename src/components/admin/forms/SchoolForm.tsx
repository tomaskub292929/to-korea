'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Save, Upload, X, Plus } from 'lucide-react';

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
  const [activeTab, setActiveTab] = useState<'en' | 'ru' | 'de'>('en');
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>(
    initialData?.programs || []
  );

  const toggleProgram = (program: string) => {
    setSelectedPrograms((prev) =>
      prev.includes(program)
        ? prev.filter((p) => p !== program)
        : [...prev, program]
    );
  };

  return (
    <div className="space-y-6">
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
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    activeTab === tab.id
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
                  defaultValue={
                    activeTab === 'en'
                      ? initialData?.name
                      : activeTab === 'ru'
                      ? initialData?.nameRu
                      : initialData?.nameDe
                  }
                  placeholder={`School name in ${activeTab.toUpperCase()}`}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description {activeTab === 'en' && <span className="text-red-500">*</span>}
                </label>
                <textarea
                  rows={4}
                  defaultValue={
                    activeTab === 'en'
                      ? initialData?.description
                      : activeTab === 'ru'
                      ? initialData?.descriptionRu
                      : initialData?.descriptionDe
                  }
                  placeholder={`Description in ${activeTab.toUpperCase()} (300-500 characters recommended)`}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-[var(--leica-orange)] resize-none"
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
                  defaultValue={initialData?.country || 'South Korea'}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
                >
                  <option value="South Korea">South Korea</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City <span className="text-red-500">*</span>
                </label>
                <select
                  defaultValue={initialData?.city}
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
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
                  defaultValue={initialData?.websiteUrl}
                  placeholder="https://www.example.ac.kr"
                  className="w-full h-10 px-4 border border-gray-200 rounded-lg"
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
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    selectedPrograms.includes(program)
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
              <button className="w-full flex items-center justify-center gap-2 h-10 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
                <Save className="w-4 h-4" />
                {isEdit ? 'Update School' : 'Create School'}
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
    </div>
  );
}
