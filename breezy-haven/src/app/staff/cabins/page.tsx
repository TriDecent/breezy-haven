import { CabinsList } from '@/features/staff/cabins';
import { ROUTES, Spinner } from '@/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.cabins.metadata;

export default function CabinsPage() {
  // TODO: verify staff authentication

  return (
    <section>
      <h1 className='text-accent-500 mb-4 text-2xl font-semibold tracking-widest'>
        All cabins
      </h1>
      <Suspense fallback={<Spinner />}>
        <CabinsList />
      </Suspense>
    </section>
  );
}
