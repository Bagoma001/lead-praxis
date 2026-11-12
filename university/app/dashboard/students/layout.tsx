'use client';

import { RouteGuard } from '@/components/auth/route-guard';

export default function StudentsLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only department_admin, super_admin, and lecturer can access student pages
  return (
    <RouteGuard allowedRoles={['student',  'lecturer', 'department_admin', 'super_admin']}>
      {children}
    </RouteGuard>
  );
}
