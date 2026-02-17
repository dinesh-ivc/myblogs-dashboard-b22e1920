'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, FileText, PlusCircle, FileEdit, User, Settings, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/', label: 'Home', icon: Home, roles: ['admin', 'author', 'reader'] },
  { href: '/admin', label: 'My Posts', icon: FileText, roles: ['admin', 'author'] },
  { href: '/admin/create', label: 'Create Post', icon: PlusCircle, roles: ['admin', 'author'] },
  { href: '/admin/drafts', label: 'Drafts', icon: FileEdit, roles: ['admin', 'author'] },
  { href: '/profile', label: 'Profile', icon: User, roles: ['admin', 'author', 'reader'] },
  { href: '/settings', label: 'Settings', icon: Settings, roles: ['admin', 'author', 'reader'] },
  { href: '/admin/dashboard', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
];

export default function Sidebar({ userRole = 'reader' }) {
  const pathname = usePathname();
  
  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  return (
    <aside className="w-64 bg-white border-r border-gray-200 min-h-screen p-4">
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 px-4">MyBlogs</h2>
        <p className="text-sm text-gray-500 px-4">Dashboard</p>
      </div>
      
      <nav className="space-y-1">
        {filteredNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : 'text-gray-700 hover:bg-gray-50'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}