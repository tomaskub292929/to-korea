'use client';

import { ReactNode } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: ReactNode;
  iconBg?: string;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = 'vs last week',
  icon,
  iconBg = 'bg-blue-100',
}: StatCardProps) {
  const isPositive = change && change > 0;
  const isNegative = change && change < 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-2">{value}</p>

          {change !== undefined && (
            <div className="flex items-center gap-1 mt-2">
              {isPositive && (
                <>
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm font-medium text-green-600">
                    +{change}%
                  </span>
                </>
              )}
              {isNegative && (
                <>
                  <TrendingDown className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-medium text-red-600">
                    {change}%
                  </span>
                </>
              )}
              {!isPositive && !isNegative && (
                <span className="text-sm font-medium text-gray-500">0%</span>
              )}
              <span className="text-xs text-gray-400 ml-1">{changeLabel}</span>
            </div>
          )}
        </div>

        <div className={cn('p-3 rounded-lg', iconBg)}>
          {icon}
        </div>
      </div>
    </div>
  );
}
