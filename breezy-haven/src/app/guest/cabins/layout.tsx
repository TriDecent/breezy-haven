'use cache';
import { SearchBar } from '@/features/guest/cabins';
import { cacheLife } from 'next/cache';
import type { ReactNode } from 'react';

export default async function CabinLayout({
  children,
}: {
  children: ReactNode;
}) {
  cacheLife('default-strategy');
  return (
    <>
      {children}
      <SearchBar />
    </>
  );
}
