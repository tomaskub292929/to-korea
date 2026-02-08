'use client';

import { Users, GraduationCap, FileText, Star, TrendingUp, BarChart3 } from 'lucide-react';
import { AdminLayout } from '@/components/admin/layout';
import {
  StatCard,
  RecentActivity,
  AlertsWidget,
  SignupChart,
  PopularSchoolsChart,
  RegionDistributionChart,
  ApplicationStatusChart,
} from '@/components/admin/dashboard';

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" subtitle="Welcome back, Admin">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Users"
          value="15,234"
          change={12}
          icon={<Users className="w-5 h-5 text-blue-600" />}
          iconBg="bg-blue-100"
        />
        <StatCard
          title="Active Schools"
          value="52"
          change={4}
          changeLabel="new this month"
          icon={<GraduationCap className="w-5 h-5 text-purple-600" />}
          iconBg="bg-purple-100"
        />
        <StatCard
          title="Monthly Applications"
          value="623"
          change={15}
          icon={<FileText className="w-5 h-5 text-green-600" />}
          iconBg="bg-green-100"
        />
        <StatCard
          title="Average Rating"
          value="4.7"
          change={2}
          icon={<Star className="w-5 h-5 text-amber-600" />}
          iconBg="bg-amber-100"
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard
          title="New Signups (7 days)"
          value="342"
          change={8}
          icon={<TrendingUp className="w-5 h-5 text-emerald-600" />}
          iconBg="bg-emerald-100"
        />
        <StatCard
          title="Pending Reviews"
          value="12"
          icon={<Star className="w-5 h-5 text-orange-600" />}
          iconBg="bg-orange-100"
        />
        <StatCard
          title="Total Reviews"
          value="1,847"
          change={5}
          icon={<BarChart3 className="w-5 h-5 text-indigo-600" />}
          iconBg="bg-indigo-100"
        />
      </div>

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <SignupChart />
        <PopularSchoolsChart />
      </div>

      {/* Charts Row 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <RegionDistributionChart />
        <ApplicationStatusChart />
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertsWidget />
        <RecentActivity />
      </div>
    </AdminLayout>
  );
}
