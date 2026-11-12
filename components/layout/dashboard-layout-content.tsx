"use client";

import { useCurrentUser } from "@/api/Queries";
import { Spinner } from "@/components/ui/spinner";
import { Sidebar } from "./sidebar";
import { Header } from "./header";

export function DashboardLayoutContent({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: user, isLoading } = useCurrentUser();

  if (isLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner isLoading size="lg" label="Loading dashboard" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar userRole={user.role} />
      <div className="pl-64">
        <Header />
        <main className="pt-16 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
