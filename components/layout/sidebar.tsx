'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  BookOpen,
  GraduationCap,
  Users,
  FileText,
  Settings,
  Building2,
  UserCog,
  FolderOpen,
  ClipboardList,
  BarChart3,
} from 'lucide-react';
import { UserRole } from '@/types';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  {
    label: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
    roles: ['student', 'lecturer', 'department_admin', 'super_admin'],
  },
  {
    label: 'My Courses',
    href: '/dashboard/courses',
    icon: BookOpen,
    roles: ['student', 'lecturer'],
  },
  {
    label: 'Course Registration',
    href: '/dashboard/registration',
    icon: ClipboardList,
    roles: ['student'],
  },
  {
    label: 'My Results',
    href: '/dashboard/results',
    icon: FileText,
    roles: ['student'],
  },
  {
    label: 'Profile',
    href: '/dashboard/profile',
    icon: Users,
    roles: ['student', 'lecturer'],
  },
  {
    label: 'Grade Entry',
    href: '/dashboard/grades',
    icon: FileText,
    roles: ['lecturer'],
  },
  {
    label: 'Students',
    href: '/dashboard/students',
    icon: GraduationCap,
    roles: ['department_admin', 'super_admin'],
  },
  {
    label: 'Lecturers',
    href: '/dashboard/lecturers',
    icon: UserCog,
    roles: ['department_admin', 'super_admin'],
  },
  {
    label: 'Courses',
    href: '/dashboard/courses-manage',
    icon: BookOpen,
    roles: ['department_admin', 'super_admin'],
  },
  {
    label: 'Result Approval',
    href: '/dashboard/approvals',
    icon: ClipboardList,
    roles: ['department_admin', 'super_admin'],
  },
  {
    label: 'Faculties',
    href: '/dashboard/faculties',
    icon: Building2,
    roles: ['super_admin'],
  },
  {
    label: 'Departments',
    href: '/dashboard/departments',
    icon: FolderOpen,
    roles: ['super_admin'],
  },
  {
    label: 'Programs',
    href: '/dashboard/programs',
    icon: GraduationCap,
    roles: ['super_admin'],
  },
  {
    label: 'Sessions',
    href: '/dashboard/sessions',
    icon: Settings,
    roles: ['super_admin'],
  },
  {
    label: 'Reports',
    href: '/dashboard/reports',
    icon: BarChart3,
    roles: ['department_admin', 'super_admin'],
  },
];

interface SidebarProps {
  userRole: UserRole;
}

export function Sidebar({ userRole }: SidebarProps) {
  const pathname = usePathname();
  const filteredItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-gray-200 bg-white">
      <div className="flex h-full flex-col overflow-y-auto">
        <div className="flex items-center justify-center h-20 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-blue-600">UniPortal</h1>
        </div>
        <nav className="flex-1 space-y-1 px-3 py-4">
          {filteredItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-700 hover:bg-gray-100'
                )}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
