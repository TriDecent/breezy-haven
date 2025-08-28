import { CabinsList } from '@/features/staff/cabins';
import { Spinner } from '@/shared';
import { Suspense } from 'react';

export default function CabinsPage() {
  return (
    <section>
      <h1 className='text-2xl font-semibold tracking-widest text-accent-500 mb-4'>All cabins</h1>
      <Suspense fallback={<Spinner />}>
        <CabinsList />
      </Suspense>
    </section>
  );
}
