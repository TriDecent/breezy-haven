'use client';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { notFound, useSearchParams } from 'next/navigation';
import { cabinCapacities, viewSizeClassifier } from './sizeClassifier';

import type { Cabin } from '@/shared';
import CabinsDisplay from './CabinsDisplay';

export default function FilteredCabins({ cabins }: { cabins: Cabin[] }) {
  const params = useSearchParams();
  const capacity = params.get('capacity') ?? 'all';

  if (!cabinCapacities.includes(capacity)) notFound();

  const filteredCabins = filterCabinsBasedOnCapacity(capacity, cabins);

  return <CabinsDisplay cabins={filteredCabins} />;
}

function filterCabinsBasedOnCapacity(
  capacity: string,
  cabins: NonNullableObject<DTOCabin>[]
): Cabin[] {
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
