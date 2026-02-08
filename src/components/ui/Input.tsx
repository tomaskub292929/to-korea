'use client';

import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  icon?: 'search' | 'none';
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, icon = 'none', ...props }, ref) => {
    return (
      <div className="relative w-full">
        {icon === 'search' && (
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-[var(--warm-gray)]" />
        )}
        <input
          ref={ref}
          className={cn(
            'w-full h-11 bg-[var(--off-white)] border border-[var(--leica-gold)] rounded px-4 py-3 text-base text-[var(--deep-navy)] placeholder:text-[var(--warm-gray)]/60 transition-all duration-200',
            'focus:outline-none focus:border-2 focus:border-[var(--leica-orange)]',
            'disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed',
            error && 'border-2 border-[var(--alert)]',
            icon === 'search' && 'pl-12',
            className
          )}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-[var(--alert)]">{error}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
