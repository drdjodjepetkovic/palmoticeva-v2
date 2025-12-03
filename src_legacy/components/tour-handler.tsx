
'use client';

import { useAuth } from '@/context/auth-context';
import { useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { useEventBus } from '@/context/event-bus-context';
import { UserEventType } from '@/lib/events';


export function TourHandler() {
  const { user, userProfile, loading } = useAuth();
  const { emit } = useEventBus();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This logic is now handled by the AuthProvider upon new user creation.
    // It emits a WalkthroughStart event. This component is now simpler.
    const isTourActive = searchParams.get('tour') === 'true';

    // The component that responds to `WalkthroughStart` will handle showing the UI.
    // We keep this component in case we need to re-introduce logic for showing
    // the tour to anonymous users in the future.
    
  }, [loading, user, userProfile, searchParams, emit]);

  return null;
}
