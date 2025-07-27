import {
  CabinLoading,
  CabinQuery,
  CabinsList,
  Filter,
  ReservationReminder,
} from '@/features/cabins';

import { Metadata } from 'next';
import { Suspense } from 'react';

// export const revalidate = 3600; // not effective anymore because of searchParams

export const metadata: Metadata = {
  title: 'Cabins',
};

type FilterType = Partial<CabinQuery>;

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<FilterType>;
}) {
  const capacityFilter = (await searchParams).capacity ?? 'all';

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

      <Suspense fallback={<CabinLoading />} key={capacityFilter}>
        <CabinsList capacity={capacityFilter} />
        <ReservationReminder />
      </Suspense>
    </>
  );
}
