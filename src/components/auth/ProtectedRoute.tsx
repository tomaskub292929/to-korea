'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole | UserRole[];
  fallback?: React.ReactNode;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requiredRole,
  fallback,
  redirectTo = '/login',
}: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      // User not logged in
      if (!user) {
        const currentPath = window.location.pathname;
        router.push(`${redirectTo}?redirect=${encodeURIComponent(currentPath)}`);
        return;
      }

      // Check role if required
      if (requiredRole) {
        const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRequiredRole = allowedRoles.includes(user.role);

        if (!hasRequiredRole) {
          router.push('/unauthorized');
        }
      }
    }
  }, [user, loading, requiredRole, router, redirectTo]);

  // Show loading state
  if (loading) {
    return (
      fallback || (
        <div className="min-h-screen flex items-center justify-center bg-[var(--off-white)]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-[var(--leica-orange)] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-[var(--warm-gray)]">Loading...</p>
          </div>
        </div>
      )
    );
  }

  // User not logged in
  if (!user) {
    return null;
  }

  // Check role permission
  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRequiredRole = allowedRoles.includes(user.role);

    if (!hasRequiredRole) {
      return null;
    }
  }

  return <>{children}</>;
}
