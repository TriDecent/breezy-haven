import { SearchBar } from '@/features/cabins';
import type { ReactNode } from 'react';
import { Toaster } from 'sonner';

export default function CabinLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <SearchBar />
      <Toaster richColors position='top-center'/>
    </>
  );
}
