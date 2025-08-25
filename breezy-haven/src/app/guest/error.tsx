'use client';

import { Error } from '@/shared';

export default function GuestError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <Error message={error.message} onRetry={reset} />;
}
