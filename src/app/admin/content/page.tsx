'use client';

import Link from 'next/link';
import {
  Globe,
  FileText,
  Languages,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Edit,
} from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';

const translationProgress = [
  { lang: 'English', code: 'EN', flag: '🇬🇧', progress: 100 },
  { lang: 'Russian', code: 'RU', flag: '🇷🇺', progress: 62 },
  { lang: 'German', code: 'DE', flag: '🇩🇪', progress: 48 },
];

const staticPages = [
  { name: 'About Us', path: '/about', lastUpdated: '2026-02-01', status: 'published' },
  { name: 'FAQ', path: '/faq', lastUpdated: '2026-01-28', status: 'published' },
  { name: 'Privacy Policy', path: '/privacy', lastUpdated: '2026-01-15', status: 'published' },
  { name: 'Terms of Service', path: '/terms', lastUpdated: '2026-01-15', status: 'published' },
  { name: 'Contact', path: '/contact', lastUpdated: '2026-02-05', status: 'published' },
];

const translationCategories = [
  { name: 'UI Text', enCount: 150, ruCount: 142, deCount: 135 },
  { name: 'School Information', enCount: 52, ruCount: 24, deCount: 16 },
  { name: 'FAQ Content', enCount: 25, ruCount: 20, deCount: 18 },
  { name: 'Email Templates', enCount: 12, ruCount: 7, deCount: 6 },
];

export default function ContentPage() {
  return (
    <AdminLayout title="Content" subtitle="Manage translations and static pages">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Translation Progress */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <Languages className="w-5 h-5" />
              Translation Progress
            </h3>
            <Link
              href="/admin/content/translations"
              className="text-sm text-[var(--leica-orange)] hover:underline"
            >
              Manage Translations →
            </Link>
          </div>

          <div className="space-y-4">
            {translationProgress.map((lang) => (
              <div key={lang.code}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{lang.flag}</span>
                    <span className="font-medium">{lang.lang}</span>
                  </div>
                  <span className={`text-sm font-medium ${
                    lang.progress === 100 ? 'text-green-600' : 'text-amber-600'
                  }`}>
                    {lang.progress}%
                  </span>
                </div>
                <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      lang.progress === 100 ? 'bg-green-500' : 'bg-amber-500'
                    }`}
                    style={{ width: `${lang.progress}%` }}
                  />
                </div>
                {lang.progress < 100 && (
                  <p className="text-xs text-gray-500 mt-1">
                    {Math.round((100 - lang.progress) * 2.39)} items need translation
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Translation by Category */}
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-6">By Category</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 text-sm font-medium text-gray-500">Category</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">🇬🇧 EN</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">🇷🇺 RU</th>
                  <th className="text-center py-2 text-sm font-medium text-gray-500">🇩🇪 DE</th>
                </tr>
              </thead>
              <tbody>
                {translationCategories.map((cat) => (
                  <tr key={cat.name} className="border-b last:border-0">
                    <td className="py-3 text-sm">{cat.name}</td>
                    <td className="py-3 text-center">
                      <span className="text-green-600">{cat.enCount}</span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cat.ruCount < cat.enCount ? 'text-amber-600' : 'text-green-600'}>
                        {cat.ruCount}
                      </span>
                    </td>
                    <td className="py-3 text-center">
                      <span className={cat.deCount < cat.enCount ? 'text-amber-600' : 'text-green-600'}>
                        {cat.deCount}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Static Pages */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Static Pages
            </h3>
          </div>

          <div className="space-y-3">
            {staticPages.map((page) => (
              <div
                key={page.path}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center border">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{page.name}</p>
                    <p className="text-sm text-gray-500">{page.path}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm">Published</span>
                    </div>
                    <p className="text-xs text-gray-500">Updated {page.lastUpdated}</p>
                  </div>
                  <Link
                    href={`/admin/content/pages${page.path}`}
                    className="p-2 hover:bg-white rounded-lg transition-colors"
                  >
                    <Edit className="w-4 h-4 text-gray-500" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
