'use client';

import { notFound, useSearchParams } from 'next/navigation';
import {
  CabinCapacities,
  ViewSizeClassifier,
} from '../constants/SizeClassifier';

import type { Cabin } from '@/shared/schemas';
import type { RootState } from '@/shared/store';
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
  const [isFirstRender, setIsFirstRender] = useState(true);

  if (!CabinCapacities.includes(capacity)) notFound();

  const currentQuery = queryFromStore ?? query ?? '';

  const updateCabinsAction = useCallback(
    async (query: string, capacity: string) => {
      await new Promise(resolve => setTimeout(resolve, 300)); // debounce for loading to show while user typing

      const queryCabins = cabins.filter(cabin =>
        `cabin ${cabin.name}`.toLowerCase().includes(query)
      );

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

  useEffect(() => setIsFirstRender(false), []);

  return isPending && !isFirstRender ? (
    <CabinLoading />
  ) : (
    <CabinsDisplay cabins={displayedCabins} />
  );
}

function filterCabinsBasedOnCapacity(
  capacity: string,
  cabins: Cabin[]
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
