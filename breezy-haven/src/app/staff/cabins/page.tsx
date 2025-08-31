import { CabinsList } from '@/features/staff/cabins';
import { Spinner } from '@/shared';
import { Suspense } from 'react';

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
