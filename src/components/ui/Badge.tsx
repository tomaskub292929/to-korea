'use client';

import { cn } from '@/lib/utils';

interface BadgeProps {
  variant?: 'default' | 'high' | 'medium' | 'low' | 'success' | 'alert' | 'info';
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant = 'default', children, className }: BadgeProps) {
  const variants = {
    default: 'bg-[var(--warm-gray)] text-white',
    high: 'bg-[var(--leica-orange)] text-white',
    medium: 'bg-[var(--leica-gold)] text-[var(--deep-navy)]',
    low: 'bg-[var(--warm-gray)] text-white',
    success: 'bg-[var(--success)] text-white',
    alert: 'bg-[var(--alert)] text-white',
    info: 'bg-[var(--info)] text-white',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
