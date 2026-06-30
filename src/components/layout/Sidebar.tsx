'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Code2,
  BrainCircuit,
  Database,
  Cpu,
  Server,
  Map,
  BarChart3,
  BookOpen,
  LibraryBig
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'DSA Track', href: '/dashboard/dsa', icon: Code2 },
  { name: 'Aptitude', href: '/dashboard/aptitude', icon: BrainCircuit },
  { name: 'SQL', href: '/dashboard/sql', icon: Database },
  { name: 'Core Subjects', href: '/dashboard/core', icon: Cpu },
  { name: 'System Design', href: '/dashboard/system-design', icon: Server },
  { name: 'Roadmap', href: '/dashboard/roadmap', icon: Map },
  { name: 'Analytics', href: '/dashboard/analytics', icon: BarChart3 },
  { name: 'Resources', href: '/dashboard/resources', icon: LibraryBig },
  { name: 'Notes', href: '/dashboard/notes', icon: BookOpen },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="hidden lg:flex h-screen w-64 flex-col fixed inset-y-0 left-0 z-50 bg-card/50 backdrop-blur-xl border-r border-border">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">RoadToOffer</span>
        </Link>
      </div>

      <ScrollArea className="flex-1 px-4 py-6">
        <nav className="flex flex-col gap-2">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium',
                  isActive
                    ? 'bg-primary/10 text-primary border border-primary/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                )}
              >
                <item.icon className={cn('w-5 h-5', isActive ? 'text-primary' : '')} />
                {item.name}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>
      
      <div className="p-4 border-t border-border">
        <div className="glass-panel p-4 flex flex-col items-center justify-center text-center gap-2">
          <p className="text-xs text-muted-foreground font-medium">Days to Placements</p>
          <div className="text-3xl font-black text-gradient">92</div>
        </div>
      </div>
    </div>
  );
}
