import {
  CabinLoading,
  CabinsList,
  Filter,
  ReservationReminder,
} from '@/features/cabins';
import { ROUTES } from '@/shared';

import { Metadata } from 'next';
import { Suspense } from 'react';

export const revalidate = 3600;

export const metadata: Metadata = ROUTES.cabins.metadata;

export default function Page() {
  return (
    <>
      <h1 className='text-accent-400 mb-5 text-xl font-medium md:text-2xl lg:text-4xl'>
        Our Luxury Cabins
      </h1>
      <p className='text-primary-200 mb-10 lg:text-lg'>
        Cozy yet luxurious cabins, located right in the heart of the Italian
        Dolomites. Imagine waking up to beautiful mountain views, spending your
        days exploring the dark forests around, or just relaxing in your private
        hot tub under the stars. Enjoy nature&apos;s beauty in your own little
        home away from home. The perfect spot for a peaceful, calm vacation.
        Welcome to paradise.
      </p>

      <div className='mb-10 sm:self-end'>
        <Filter />
      </div>

      <Suspense fallback={<CabinLoading />}>
        <CabinsList />
      </Suspense>
      <ReservationReminder />
    </>
  );
}
