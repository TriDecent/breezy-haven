'use client';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { notFound, useSearchParams } from 'next/navigation';
import CabinCard from './CabinCard';
import { cabinCapacities, viewSizeClassifier } from './sizeClassifier';

export default function FilteredCabins({
  cabins,
}: {
  cabins: NonNullableObject<DTOCabin>[];
}) {
  const params = useSearchParams();
  const capacity = params.get('capacity') ?? 'all';

  if (!cabinCapacities.includes(capacity)) notFound();

  const filteredCabins = filterCabinsBasedOnCapacity(
    capacity,
    cabins as NonNullableObject<DTOCabin>[]
  );

  return filteredCabins.length > 0 ? (
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
  capacity: string,
  cabins: NonNullableObject<DTOCabin>[]
): ReadonlyArray<NonNullableObject<DTOCabin>> {
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

    default:
      return cabins;
  }
}
