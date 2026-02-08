'use client';

import { cn } from '@/lib/utils';
import { forwardRef, ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'text';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold transition-all duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50';

    const variants = {
      primary:
        'bg-[var(--leica-orange)] text-white hover:bg-[#E67E00] hover:shadow-lg hover:shadow-[var(--leica-orange)]/30 active:bg-[#CC6600] active:translate-y-[1px] focus-visible:ring-[var(--leica-orange)]',
      secondary:
        'bg-transparent text-[var(--leica-orange)] border-2 border-[var(--leica-orange)] hover:bg-[var(--light-cream)] active:bg-[#FFE082] focus-visible:ring-[var(--leica-orange)]',
      text:
        'bg-transparent text-[var(--leica-orange)] hover:underline hover:decoration-[var(--leica-gold)] hover:decoration-2 active:text-[#CC6600] p-0',
    };

    const sizes = {
      sm: 'h-9 px-4 text-sm rounded',
      md: 'h-11 px-8 text-base rounded',
      lg: 'h-12 px-10 text-lg rounded',
    };

    return (
      <button
        ref={ref}
        className={cn(
          baseStyles,
          variants[variant],
          variant !== 'text' && sizes[size],
          className
        )}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="mr-2 inline-block h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
        ) : null}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
