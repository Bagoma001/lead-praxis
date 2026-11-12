'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {useCurrentUser} from "@/api/Queries";
import { UserRole } from '@/types';
import { Loader2 } from 'lucide-react';

interface RouteGuardProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export function RouteGuard({ children, allowedRoles }: RouteGuardProps) {
  const { data: user, isLoading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!user) {
        router.push('/login');
        return;
      }

      // If user role is not allowed for this route, redirect to dashboard
      if (allowedRoles && user && !allowedRoles.includes(user.role)) {
        router.push('/dashboard');
      }
    }
  }, [user, isLoading, allowedRoles, router]);

  // Show loading state while checking authentication
  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If role is not allowed, show nothing while redirecting
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
