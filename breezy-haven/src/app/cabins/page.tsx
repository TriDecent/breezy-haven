import { CabinCard } from '@/features/cabins';
import { cabinService } from '@/services';

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Cabins',
};

export default async function Page() {
  const { data: cabins, error } = await cabinService.getAll();

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

      {error ? (
        <p>
          {error.code}: {error.message}
        </p>
      ) : cabins.length > 0 ? (
        <section>
          <ul className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'>
            {cabins.map(cabin => (
              <li key={cabin.id}>
                <CabinCard cabin={cabin} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </>
  );
}
