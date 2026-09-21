'use client';

import { Error } from '@/shared/components';

export default function GuestError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <Error message={error.message} onRetry={reset} />;
}
