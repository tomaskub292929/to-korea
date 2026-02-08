'use client';

import {
  Users,
  GraduationCap,
  FileText,
  TrendingUp,
  Globe,
  Calendar,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  AreaChart,
  Area,
} from 'recharts';
import { AdminLayout } from '@/components/admin/layout';

// User metrics data
const userMetrics = [
  { date: 'Jan', dau: 450, wau: 1200, mau: 3500 },
  { date: 'Feb', dau: 520, wau: 1400, mau: 4200 },
  { date: 'Mar', dau: 610, wau: 1650, mau: 5100 },
  { date: 'Apr', dau: 580, wau: 1580, mau: 4800 },
  { date: 'May', dau: 720, wau: 1900, mau: 5800 },
  { date: 'Jun', dau: 850, wau: 2200, mau: 6500 },
];

// Application funnel
const funnelData = [
  { stage: 'Page Views', value: 15000, color: '#3B82F6' },
  { stage: 'School Saved', value: 1800, color: '#8B5CF6' },
  { stage: 'Application Started', value: 620, color: '#F59E0B' },
  { stage: 'Application Submitted', value: 380, color: '#10B981' },
  { stage: 'Accepted', value: 106, color: '#059669' },
];

// Country distribution
const countryData = [
  { name: 'Germany', value: 35, color: '#FF8C00' },
  { name: 'Russia', value: 28, color: '#3B82F6' },
  { name: 'France', value: 15, color: '#10B981' },
  { name: 'Kazakhstan', value: 12, color: '#8B5CF6' },
  { name: 'Ukraine', value: 6, color: '#F59E0B' },
  { name: 'Others', value: 4, color: '#6B7280' },
];

// Top schools by applications
const topSchools = [
  { name: 'Seoul National Univ.', applications: 156, accepted: 44 },
  { name: 'Korea University', applications: 142, accepted: 38 },
  { name: 'Yonsei University', applications: 138, accepted: 42 },
  { name: 'KAIST', applications: 125, accepted: 51 },
  { name: 'POSTECH', applications: 98, accepted: 35 },
];

// Weekly activity
const weeklyActivity = [
  { day: 'Mon', signups: 45, applications: 12, reviews: 8 },
  { day: 'Tue', signups: 52, applications: 15, reviews: 6 },
  { day: 'Wed', signups: 48, applications: 18, reviews: 11 },
  { day: 'Thu', signups: 61, applications: 14, reviews: 9 },
  { day: 'Fri', signups: 55, applications: 20, reviews: 7 },
  { day: 'Sat', signups: 32, applications: 8, reviews: 4 },
  { day: 'Sun', signups: 28, applications: 6, reviews: 3 },
];

export default function AnalyticsPage() {
  return (
    <AdminLayout title="Analytics" subtitle="Platform metrics and insights">
      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Monthly Active</p>
              <p className="text-2xl font-bold">6,547</p>
              <p className="text-xs text-green-600">↑ 12.3% vs last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <GraduationCap className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">School Views</p>
              <p className="text-2xl font-bold">15,234</p>
              <p className="text-xs text-green-600">↑ 8.7% vs last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <FileText className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Applications</p>
              <p className="text-2xl font-bold">623</p>
              <p className="text-xs text-green-600">↑ 15.2% vs last month</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Acceptance Rate</p>
              <p className="text-2xl font-bold">28.4%</p>
              <p className="text-xs text-green-600">↑ 2.1% vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* User Activity Trends */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">User Activity Trends</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={userMetrics}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 12 }} stroke="#9CA3AF" />
                <Tooltip />
                <Legend />
                <Area type="monotone" dataKey="mau" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} name="MAU" />
                <Area type="monotone" dataKey="wau" stackId="2" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.3} name="WAU" />
                <Area type="monotone" dataKey="dau" stackId="3" stroke="#10B981" fill="#10B981" fillOpacity={0.3} name="DAU" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Application Funnel */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4">Conversion Funnel</h3>
          <div className="space-y-3">
            {funnelData.map((item, index) => {
              const width = (item.value / funnelData[0].value) * 100;
              return (
                <div key={item.stage}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">{item.stage}</span>
                    <span className="font-medium">{item.value.toLocaleString()}</span>
                  </div>
                  <div className="h-8 bg-gray-100 rounded-lg overflow-hidden">
                    <div
                      className="h-full rounded-lg flex items-center justify-end pr-3"
                      style={{ width: `${width}%`, backgroundColor: item.color }}
                    >
                      {width > 20 && (
                        <span className="text-white text-xs font-medium">
                          {index > 0 && `${((item.value / funnelData[index - 1].value) * 100).toFixed(1)}%`}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        {/* Country Distribution */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Globe className="w-5 h-5" />
            Users by Country
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={countryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="value"
                >
                  {countryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {countryData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-xs text-gray-600">{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </div>

        {/* Top Schools */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <GraduationCap className="w-5 h-5" />
            Top Schools
          </h3>
          <div className="space-y-3">
            {topSchools.map((school, index) => (
              <div key={school.name} className="flex items-center gap-3">
                <span className="w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium">
                  {index + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{school.name}</p>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <span>{school.applications} apps</span>
                    <span>•</span>
                    <span className="text-green-600">{school.accepted} accepted</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity */}
        <div className="bg-white rounded-xl border p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Weekly Activity
          </h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyActivity}>
                <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <YAxis tick={{ fontSize: 10 }} stroke="#9CA3AF" />
                <Tooltip />
                <Bar dataKey="signups" fill="#3B82F6" radius={[2, 2, 0, 0]} name="Signups" />
                <Bar dataKey="applications" fill="#10B981" radius={[2, 2, 0, 0]} name="Applications" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Export Section */}
      <div className="bg-white rounded-xl border p-6">
        <h3 className="text-lg font-semibold mb-4">Generate Report</h3>
        <div className="flex items-center gap-4">
          <select className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm">
            <option value="weekly">Weekly Report</option>
            <option value="monthly">Monthly Report</option>
            <option value="quarterly">Quarterly Report</option>
          </select>
          <input type="date" className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm" />
          <span className="text-gray-500">to</span>
          <input type="date" className="h-10 px-4 bg-white border border-gray-200 rounded-lg text-sm" />
          <button className="h-10 px-6 bg-[var(--leica-orange)] text-white rounded-lg hover:bg-[#e67e00]">
            Generate PDF
          </button>
          <button className="h-10 px-6 border border-gray-200 rounded-lg hover:bg-gray-50">
            Export Excel
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
