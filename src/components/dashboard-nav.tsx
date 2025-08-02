'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Home, Wallet, Receipt, Users, Settings } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/dashboard/income', label: 'Income', icon: Wallet },
  { href: '/dashboard/expenses', label: 'Expenses', icon: Receipt },
  { href: '/dashboard/split-bill', label: 'Split Bill', icon: Users },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
      {navItems.map((item) => (
        <Link
          key={item.href}
          href={item.href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            {
              'bg-muted text-primary': pathname === item.href,
            }
          )}
        >
          <item.icon className="h-4 w-4" />
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
