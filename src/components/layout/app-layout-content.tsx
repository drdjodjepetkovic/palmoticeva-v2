'use client';

import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Sidebar } from '@/components/layout/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppWalkthrough from '@/components/onboarding/app-walkthrough';
import Header from '@/components/header'; // Keep Header for mobile top bar if needed, or remove if Sidebar covers everything.
// Actually, on mobile we still need a top bar for Logo and maybe User Menu if not in bottom nav.
// The user said "Bottom Navigation Bar (Mobile) / Sidebar (Desktop)".
// Mobile usually has a top bar + bottom nav.
// Let's keep Header but hide it on desktop.

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, showWalkthrough } = useAuth();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (loading || !isClient) return null;

  return (
    <div className="relative flex min-h-screen bg-background">
      {showWalkthrough && <AppWalkthrough />}

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:pl-64 transition-all duration-300">
        {/* Mobile Header */}
        <div className="md:hidden">
          <Header />
        </div>

        <main className="flex-1 p-4 md:p-8 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <MobileBottomNav />
    </div>
  );
}
