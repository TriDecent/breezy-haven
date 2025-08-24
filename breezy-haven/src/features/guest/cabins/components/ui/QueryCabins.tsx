'use client';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { notFound, useSearchParams } from 'next/navigation';
import {
  CabinCapacities,
  ViewSizeClassifier,
} from '../constants/SizeClassifier';

import type { Cabin, RootState } from '@/shared';
import { useCallback, useEffect, useState, useTransition } from 'react';
import { useSelector } from 'react-redux';
import CabinLoading from './CabinLoading';
import CabinsDisplay from './CabinsDisplay';

export default function QueryCabins({ cabins }: { cabins: Cabin[] }) {
  const params = useSearchParams();
  const query = params.get('query')?.trim();
  const queryFromStore = useSelector((state: RootState) => state.ui.query);
  const capacity = params.get('capacity') ?? 'all';
  const [displayedCabins, setDisplayedCabins] = useState(cabins);
  const [isPending, startTransition] = useTransition();

  if (!CabinCapacities.includes(capacity)) notFound();

  const currentQuery = queryFromStore ?? query ?? '';

  const updateCabinsAction = useCallback(
    async (query: string, capacity: string) => {
      const queryCabins = cabins.filter(cabin =>
        `cabin ${cabin.name}`.toLowerCase().includes(query)
      );

      await new Promise(resolve => setTimeout(resolve, 300)); // debounce for loading to show while user typing
      return filterCabinsBasedOnCapacity(capacity, queryCabins);
    },
    [cabins]
  );

  useEffect(() => {
    startTransition(async () => {
      const result = await updateCabinsAction(currentQuery, capacity);
      startTransition(() => setDisplayedCabins(result));
    });
  }, [currentQuery, capacity, cabins, updateCabinsAction]);

  const shouldShowLoading = isPending && currentQuery;

  return shouldShowLoading ? (
    <CabinLoading />
  ) : (
    <CabinsDisplay identifier={capacity} cabins={displayedCabins} />
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
        cabin => cabin.maxCapacity >= ViewSizeClassifier.large.startAt
      );
    case 'medium':
      return cabins.filter(
        cabin =>
          cabin.maxCapacity >= ViewSizeClassifier.medium.startAt &&
          cabin.maxCapacity <= ViewSizeClassifier.medium.endAt
      );
    case 'small':
      return cabins.filter(
        cabin =>
          cabin.maxCapacity >= ViewSizeClassifier.small.startAt &&
          cabin.maxCapacity <= ViewSizeClassifier.small.endAt
      );

    default:
      return cabins;
  }
}
