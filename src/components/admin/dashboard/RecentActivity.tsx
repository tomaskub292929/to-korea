'use client';

import { User, GraduationCap, Star, FileText } from 'lucide-react';

interface Activity {
  id: number;
  type: 'user' | 'school' | 'review' | 'application';
  message: string;
  time: string;
}

const activities: Activity[] = [
  { id: 1, type: 'user', message: 'New user registered: Anna M. from Germany', time: '5 min ago' },
  { id: 2, type: 'application', message: 'Application submitted for Seoul National University', time: '12 min ago' },
  { id: 3, type: 'review', message: 'New review pending moderation for Korea University', time: '25 min ago' },
  { id: 4, type: 'school', message: 'School info updated: KAIST', time: '1 hour ago' },
  { id: 5, type: 'user', message: 'User profile updated: Max K.', time: '2 hours ago' },
  { id: 6, type: 'application', message: 'Application accepted for Yonsei University', time: '3 hours ago' },
];

const iconMap = {
  user: { icon: User, bg: 'bg-blue-100', color: 'text-blue-600' },
  school: { icon: GraduationCap, bg: 'bg-purple-100', color: 'text-purple-600' },
  review: { icon: Star, bg: 'bg-amber-100', color: 'text-amber-600' },
  application: { icon: FileText, bg: 'bg-green-100', color: 'text-green-600' },
};

export function RecentActivity() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        <button className="text-sm text-[var(--leica-orange)] hover:underline">
          View all
        </button>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => {
          const { icon: Icon, bg, color } = iconMap[activity.type];
          return (
            <div key={activity.id} className="flex items-start gap-3">
              <div className={`p-2 rounded-lg ${bg}`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800">{activity.message}</p>
                <p className="text-xs text-gray-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
