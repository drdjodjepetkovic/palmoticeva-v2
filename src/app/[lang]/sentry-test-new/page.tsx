'use client';

import { useEffect } from 'react';

export default function SentryTestPage() {
  useEffect(() => {
    throw new Error('This is a test error from the Sentry test page.');
  }, []);

  return <h1>Sentry Test Page</h1>;
}
