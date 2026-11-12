'use client';

import { RouteGuard } from '@/components/auth/route-guard';

export default function FacultiesLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  // Only super_admin can access faculties management
  return (
    <RouteGuard allowedRoles={['super_admin']}>
      {children}
    </RouteGuard>
  );
}
