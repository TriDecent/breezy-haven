import { CabinCardSkeleton } from '@/features/cabins';
import { Spinner } from '@/shared';

export default function Loading() {
  return (
    <section>
      <Spinner />
      <ul className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'>
        {Array.from({ length: 4 }).map((_, i) => (
          <li key={i}>
            <CabinCardSkeleton />
          </li>
        ))}
      </ul>
    </section>
  );
}
