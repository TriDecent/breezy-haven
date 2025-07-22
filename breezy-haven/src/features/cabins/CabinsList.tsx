import { cabinService } from '@/services';
// import { connection } from 'next/server';
import { Cabin } from '@/repositories';
import { CabinQuery } from '.';
import CabinCard from './CabinCard';
import { viewSizeClassifier } from './sizeClassifier';

export default async function CabinsList({ capacity }: CabinQuery) {
  // await connection();
  // Everything below will be excluded from prerendering

  const { data: cabins, error } = await cabinService.getAll();

  const filteredCabins = filterCabinsBasedOnCapacity(capacity, cabins);

  return error ? (
    <p>
      {error.code}: {error.message}
    </p>
  ) : filteredCabins.length > 0 ? (
    <section>
      <ul className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'>
        {filteredCabins.map((cabin, index) => (
          <li key={cabin.id}>
            <CabinCard cabin={cabin} isFirstCabin={index === 0} />
          </li>
        ))}
      </ul>
    </section>
  ) : null;
}

function filterCabinsBasedOnCapacity(
  capacity: CabinQuery['capacity'],
  cabins: readonly Cabin[]
): ReadonlyArray<Cabin> {
  switch (capacity) {
    case 'all':
      return cabins;
    case 'large':
      return cabins.filter(
        cabin => cabin.maxCapacity >= viewSizeClassifier.large.startAt
      );
    case 'medium':
      return cabins.filter(
        cabin =>
          cabin.maxCapacity >= viewSizeClassifier.medium.startAt &&
          cabin.maxCapacity <= viewSizeClassifier.medium.endAt
      );
    case 'small':
      return cabins.filter(
        cabin =>
          cabin.maxCapacity >= viewSizeClassifier.small.startAt &&
          cabin.maxCapacity <= viewSizeClassifier.small.endAt
      );
  }
}
