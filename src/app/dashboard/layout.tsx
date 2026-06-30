import { Header } from '@/components/layout/Header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <main className="flex-1 w-full flex justify-center py-8">
        <div className="w-full max-w-[1200px] px-4">
          {children}
        </div>
      </main>
    </div>
  );
}
