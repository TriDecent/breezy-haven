'use client';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { notFound, useSearchParams } from 'next/navigation';
import { CabinCapacities, viewSizeClassifier } from './sizeClassifier';

import type { Cabin, RootState } from '@/shared';
import { useEffect, useState, useTransition } from 'react';
import { useSelector } from 'react-redux';
import CabinLoading from './CabinLoading';
import CabinsDisplay from './CabinsDisplay';

export default function QueryCabins({ cabins }: { cabins: Cabin[] }) {
  const params = useSearchParams();
  const query = params.get('query')?.trim();
  const queryFromStore = useSelector((state: RootState) => state.ui.query);
  const capacity = params.get('capacity') ?? 'all';
  const [isPending, startTransition] = useTransition();
  const [displayedCabins, setDisplayedCabins] = useState(cabins);
  const [hasInitialized, setHasInitialized] = useState(false);

  if (!CabinCapacities.includes(capacity)) notFound();

  useEffect(() => {
    startTransition(async () => {
      const queryCabins = cabins.filter(cabin =>
        `cabin ${cabin.name}`
          .toLowerCase()
          .includes(queryFromStore ?? query ?? '')
      );
      const filteredCabins = filterCabinsBasedOnCapacity(capacity, queryCabins);

      setDisplayedCabins(filteredCabins);
      await new Promise(resolve => setTimeout(resolve, 1000));
    });
  }, [cabins, capacity, query, queryFromStore]);

  useEffect(() => {
    setHasInitialized(true);
  }, []);

  return isPending && hasInitialized ? (
    <CabinLoading />
  ) : (
    <CabinsDisplay cabins={displayedCabins} />
  );
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
