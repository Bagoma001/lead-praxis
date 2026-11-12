import { RouteGuard } from '@/components/auth/route-guard';
import { DashboardLayoutContent } from '@/components/layout/dashboard-layout-content';

export const instant = false;

export default function DashboardLayoutWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <RouteGuard>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </RouteGuard>
  );
}
