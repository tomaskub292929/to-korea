'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  GraduationCap,
  Users,
  FileText,
  Star,
  Globe,
  BarChart3,
  Settings,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const menuItems = [
  { icon: LayoutDashboard, label: 'Dashboard', href: '/admin' },
  { icon: GraduationCap, label: 'Schools', href: '/admin/schools' },
  { icon: Users, label: 'Users', href: '/admin/users' },
  { icon: FileText, label: 'Applications', href: '/admin/applications' },
  { icon: Star, label: 'Reviews', href: '/admin/reviews' },
  { icon: Globe, label: 'Content', href: '/admin/content' },
  { icon: BarChart3, label: 'Analytics', href: '/admin/analytics' },
];

const bottomItems = [
  { icon: Settings, label: 'Settings', href: '/admin/settings' },
];

export function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/admin') {
      return pathname === '/admin';
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-slate-700">
        <Link href="/admin" className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[var(--leica-orange)] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <span className="font-semibold text-lg">Gateway</span>
            <span className="text-xs block text-slate-400">Admin Panel</span>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-3">
        <ul className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-[var(--leica-orange)] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Divider */}
        <div className="my-4 border-t border-slate-700" />

        {/* Bottom Menu */}
        <ul className="space-y-1">
          {bottomItems.map((item) => {
            const active = isActive(item.href);
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-[var(--leica-orange)] text-white'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-9 h-9 bg-slate-700 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin User</p>
            <p className="text-xs text-slate-400 truncate">admin@gateway.com</p>
          </div>
          <button className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <LogOut className="w-4 h-4 text-slate-400" />
          </button>
        </div>
      </div>
    </aside>
  );
}
