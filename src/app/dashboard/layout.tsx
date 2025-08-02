import React from 'react';
import { DashboardNav } from '@/components/dashboard-nav';
import { UserNav } from '@/components/user-nav';
import { Logo } from '@/components/logo';
import { FinancialsProvider } from '@/context/financial-context';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <FinancialsProvider>
      <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
        <aside className="hidden border-r bg-card md:block">
          <div className="flex h-full max-h-screen flex-col gap-2">
            <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
               <Logo />
            </div>
            <div className="flex-1">
              <DashboardNav />
            </div>
          </div>
        </aside>
        <div className="flex flex-col">
          <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="outline"
                  size="icon"
                  className="shrink-0 md:hidden"
                >
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle navigation menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <div className="flex h-14 items-center border-b px-6">
                  <Logo />
                </div>
                <nav className="grid gap-2 text-lg font-medium p-4">
                  <DashboardNav />
                </nav>
              </SheetContent>
            </Sheet>
             <div className="w-full flex-1" />
            <UserNav />
          </header>
          <main className="flex-1 overflow-auto bg-background p-4 sm:p-6">
            {children}
          </main>
        </div>
      </div>
    </FinancialsProvider>
  );
}
