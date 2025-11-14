'use client';

import Header from '@/components/header';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { useAuth } from '@/hooks/use-auth';
import SplashScreen from '@/components/layout/splash-screen';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AppWalkthrough from '@/components/onboarding/app-walkthrough';

export default function AppLayoutContent({ children }: { children: React.ReactNode }) {
  const { loading, userProfile, showWalkthrough } = useAuth();
  const searchParams = useSearchParams();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  if (loading || !isClient) return <SplashScreen />;

  return (
    <div className="relative flex min-h-screen flex-col" style={{ minHeight: '100svh' }}>
      {showWalkthrough && <AppWalkthrough />}
      <Header />
      <main className="flex-1 pb-16 flex flex-col">{children}</main>
      <MobileBottomNav />
    </div>
  );
}
