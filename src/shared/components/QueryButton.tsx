'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, type ReactNode } from 'react';
import { Button } from './ui/button';

interface KeyValuePair {
  readonly key: string;
  readonly value: string;
}

interface QueryButtonProps {
  readonly queries: readonly KeyValuePair[];
  readonly isActive: boolean;
}

export function QueryButton({
  queries,
  isActive,
  children,
}: QueryButtonProps & { children: ReactNode }) {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleClickButton = useCallback(() => {
    const copiedSearchParams = new URLSearchParams(searchParams);
    for (const { key, value } of queries) {
      copiedSearchParams.set(key, value);
    }
    router.replace(`?${copiedSearchParams.toString()}`, { scroll: false });
  }, [queries, router, searchParams]);

  return (
    <Button
      variant='outline'
      onClick={handleClickButton}
      className={`rounded-none border-none ${isActive ? 'bg-border dark:bg-accent text-white' : ''}`}
    >
      {children}
    </Button>
  );
}
