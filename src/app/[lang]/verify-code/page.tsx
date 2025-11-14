
"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { useContent } from '@/hooks/use-content';

// This page is obsolete as of the new verification flow.
// We redirect users to their profile page.
export default function VerifyCodePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/my-profile');
  }, [router]);

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 flex justify-center">
      <p>Preusmeravanje...</p>
    </div>
  );
}

    