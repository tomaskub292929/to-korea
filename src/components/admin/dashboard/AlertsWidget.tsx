'use client';

import { AlertTriangle, FileText, GraduationCap, Flag, Users } from 'lucide-react';

interface Alert {
  id: number;
  type: 'moderation' | 'application' | 'school' | 'report' | 'user';
  message: string;
  count?: number;
  priority: 'high' | 'medium' | 'low';
}

const alerts: Alert[] = [
  { id: 1, type: 'moderation', message: 'Reviews pending moderation', count: 12, priority: 'high' },
  { id: 2, type: 'application', message: 'New applications today', count: 47, priority: 'medium' },
  { id: 3, type: 'school', message: 'School registration requests', count: 3, priority: 'medium' },
  { id: 4, type: 'report', message: 'Reported reviews', count: 2, priority: 'high' },
  { id: 5, type: 'user', message: 'New signups today', count: 15, priority: 'low' },
];

const iconMap = {
  moderation: AlertTriangle,
  application: FileText,
  school: GraduationCap,
  report: Flag,
  user: Users,
};

const priorityStyles = {
  high: 'border-l-red-500 bg-red-50',
  medium: 'border-l-amber-500 bg-amber-50',
  low: 'border-l-blue-500 bg-blue-50',
};

export function AlertsWidget() {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Alerts & Notifications</h3>
        <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full">
          {alerts.filter(a => a.priority === 'high').length} urgent
        </span>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const Icon = iconMap[alert.type];
          return (
            <div
              key={alert.id}
              className={`flex items-center gap-3 p-3 rounded-lg border-l-4 ${priorityStyles[alert.priority]}`}
            >
              <Icon className="w-5 h-5 text-gray-600" />
              <div className="flex-1">
                <p className="text-sm text-gray-800">{alert.message}</p>
              </div>
              {alert.count !== undefined && (
                <span className="text-lg font-semibold text-gray-900">{alert.count}</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
