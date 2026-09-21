'use client';

import { Error } from '@/shared/components';

export default function RootError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className='flex min-h-screen items-center'>
      <Error message={error.message} onRetry={reset} />;
    </div>
  );
}
