import { SearchBar } from '@/features/cabins';
import type { ReactNode } from 'react';

export default function CabinLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SearchBar />
    </>
  );
}
