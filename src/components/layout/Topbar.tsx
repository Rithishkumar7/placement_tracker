'use client';

import { Menu } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Sidebar } from './Sidebar';
import Link from 'next/link';
// Removed unused import

export function Topbar() {
  return (
    <div className="lg:hidden flex items-center justify-between h-16 px-4 border-b border-border bg-background/80 backdrop-blur-xl sticky top-0 z-40">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-lg">P</span>
        </div>
        <span className="text-xl font-bold text-foreground">RoadToOffer</span>
      </Link>
      
      <Sheet>
        <SheetTrigger className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-10 w-10 text-foreground transition-colors">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle Menu</span>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-64 bg-card border-r-border">
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <div className="h-full flex flex-col relative">
             {/* We can just render the Sidebar contents here, but to avoid duplicating code, we'll just import it and adjust classes if needed. 
                 Since Sidebar is fixed, we might need a modified version or just duplicate the links for simplicity in mobile. 
                 For now, let's just re-render Sidebar with static position for mobile drawer. */}
             <MobileSidebar />
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

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

function MobileSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="flex h-full w-full flex-col bg-card/50">
      <div className="flex h-16 items-center px-6 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-lg">P</span>
          </div>
          <span className="text-xl font-bold text-foreground">RoadToOffer</span>
        </div>
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
    </div>
  );
}
