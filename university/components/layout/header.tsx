'use client';

import { useCurrentUser, useLogOut } from '@/api/Queries';
import { Button } from '@/components/ui/button';
import { LogOut, User, Bell, Loader2 } from 'lucide-react';

export function Header() {
  const {data: user} = useCurrentUser();

  const getRoleLabel = (role: string) => {
    const labels: Record<string, string> = {
      student: 'Student',
      lecturer: 'Lecturer',
      department_admin: 'Department Admin',
      super_admin: 'Super Admin',
    };
    return labels[role] || role;
  };
  const { mutate: logout, isPending: isLoggingOut, error: logoutError } =
    useLogOut();

  return (
    <header className="fixed top-0 left-64 right-0 z-30 h-16 border-b border-gray-200 bg-white">
      <div className="flex h-full items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Welcome, {user?.firstName} {user?.lastName}
          </h2>
        </div>

        <div className="flex items-center gap-4">
          <button className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500" />
          </button>

          <div className="flex items-center gap-3 border-l border-gray-200 pl-4">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-800">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500">{user && getRoleLabel(user.role)}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-600">
              <User className="h-5 w-5" />
            </div>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => logout()}
            disabled={isLoggingOut}
            aria-label={logoutError ? 'Logout failed. Try again' : undefined}
            className="gap-2"
          >
            {isLoggingOut ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="h-4 w-4" />
            )}
            {isLoggingOut ? 'Logging out...' : 'Logout'}
          </Button>
          {logoutError && (
            <span className="text-xs text-red-600" role="alert">
              Logout failed
            </span>
          )}
        </div>
      </div>
    </header>
  );
}
