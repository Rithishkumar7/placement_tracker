'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { differenceInCalendarDays, format } from 'date-fns';
import { usePlacementStore } from '@/store/usePlacementStore';
import { Menu } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";

export function Header() {
  const pathname = usePathname();
  const store = usePlacementStore();
  const [isOpen, setIsOpen] = React.useState(false);
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');
  
  const startDate = new Date('2026-07-01');
  const endDate = new Date('2026-09-30');
  const today = new Date();
  const totalDays = differenceInCalendarDays(endDate, startDate);
  const currentDay = Math.max(1, Math.min(totalDays, differenceInCalendarDays(today, startDate) + 1));

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'To-Do', href: '/dashboard/todo' },
    { name: 'Resources', href: '/dashboard/resources' },
    { name: 'Analytics', href: '/dashboard/analytics' },
    { name: 'Notes', href: '/dashboard/notes' },
  ];

  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);

  const pendingTodosCount = mounted && store.todos ? store.todos.filter(t => !t.completed).length : 0;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (store.login(username, password)) {
      setIsOpen(false);
      setError('');
      setUsername('');
      setPassword('');
    } else {
      setError('Invalid credentials');
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between mx-auto px-4 max-w-[1200px]">
        <div className="flex flex-col">
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-xl font-bold text-primary">Road to Offer</span>
          </Link>
          <div className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5 font-mono">
            <span>{format(startDate, 'dd MMM')} &rarr; {format(endDate, 'dd MMM yyyy')}</span>
            <span>&bull;</span>
            <span>{totalDays} days</span>
            <span>&bull;</span>
            <span>Day {currentDay} of {totalDays}</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-2">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <Button 
                variant={pathname === item.href ? 'secondary' : 'ghost'} 
                size="sm" 
                className={cn('text-sm font-medium relative', pathname === item.href ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
              >
                {item.name}
                {mounted && item.name === 'To-Do' && pendingTodosCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-sm shadow-rose-500/50">
                    {pendingTodosCount}
                  </span>
                )}
              </Button>
            </Link>
          ))}
          <div className="w-px h-4 bg-border mx-2" />
          
          {store.isAdmin ? (
            <Button variant="outline" size="sm" className="text-xs font-mono h-8 border-rose-500/20 text-rose-500 hover:bg-rose-500/10" onClick={() => store.logout()}>
              Admin: Logout
            </Button>
          ) : (
            <Button variant="outline" size="sm" className="text-xs font-mono h-8" onClick={() => setIsOpen(true)}>
              Admin Login
            </Button>
          )}
        </nav>

        {/* Mobile Navigation (Hamburger) */}
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger className="inline-flex items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground h-10 w-10">
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px] border-l border-border bg-background/95 backdrop-blur">
              <SheetHeader className="mb-6">
                <SheetTitle className="text-left font-mono">Menu</SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-2">
                {navItems.map((item) => (
                  <Link key={item.href} href={item.href}>
                    <Button 
                      variant={pathname === item.href ? 'secondary' : 'ghost'} 
                      className={cn('w-full justify-start font-medium relative', pathname === item.href ? 'bg-secondary text-foreground' : 'text-muted-foreground hover:text-foreground')}
                    >
                      {item.name}
                      {mounted && item.name === 'To-Do' && pendingTodosCount > 0 && (
                        <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-rose-500 text-[11px] font-bold text-white shadow-sm shadow-rose-500/50">
                          {pendingTodosCount}
                        </span>
                      )}
                    </Button>
                  </Link>
                ))}
                <div className="h-px w-full bg-border my-4" />
                {store.isAdmin ? (
                  <Button variant="outline" className="w-full font-mono border-rose-500/20 text-rose-500 hover:bg-rose-500/10" onClick={() => store.logout()}>
                    Admin: Logout
                  </Button>
                ) : (
                  <Button variant="outline" className="w-full font-mono" onClick={() => setIsOpen(true)}>
                    Admin Login
                  </Button>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {/* Global Admin Login Modal */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="font-mono text-center">Admin Access</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin} className="space-y-4 py-4">
              <div className="space-y-2">
                <Input 
                  placeholder="Username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Input 
                  type="password"
                  placeholder="Password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="font-mono"
                />
              </div>
              {error && <p className="text-xs text-rose-500 font-mono text-center">{error}</p>}
              <Button type="submit" className="w-full font-mono">Authenticate</Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </header>
  );
}
