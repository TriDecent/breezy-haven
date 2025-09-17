'use client';

import { Error } from '@/shared/components';

export default function StaffError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return <Error message={error.message} onRetry={reset} />;
}
