'use client';

import {
  notFound,
  usePathname,
  useRouter,
  useSearchParams,
} from 'next/navigation';
import { HTMLAttributes, useCallback } from 'react';
import {
  cabinCapacities,
  CabinQuery,
  viewSizeClassifier,
} from './sizeClassifier';

export default function Filter() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const capacityQuery = searchParams.get('capacity') ?? 'all';

  const handleFilter = useCallback(
    (filter: CabinQuery['capacity']): void => {
      const params = new URLSearchParams();
      params.set('capacity', filter);

      router.push(`${pathname}?${params.toString()}#test`, { scroll: false });
    },
    [pathname, router]
  );

  if (!cabinCapacities.includes(capacityQuery)) {
    notFound();
  }

  return (
    <nav className='border-primary-800 flex justify-between rounded border'>
      <Button
        isActive={capacityQuery === 'all'}
        onClick={() => handleFilter('all')}
      >
        All cabins
      </Button>
      <Button
        isActive={capacityQuery === 'small'}
        onClick={() => handleFilter('small')}
      >
        {`${viewSizeClassifier.small.startAt} - ${viewSizeClassifier.small.endAt}`}{' '}
        guests
      </Button>
      <Button
        isActive={capacityQuery === 'medium'}
        onClick={() => handleFilter('medium')}
      >
        {' '}
        {`${viewSizeClassifier.medium.startAt} - ${viewSizeClassifier.medium.endAt}`}{' '}
        guests
      </Button>
      <Button
        isActive={capacityQuery === 'large'}
        onClick={() => handleFilter('large')}
      >
        {' '}
        {`${viewSizeClassifier.large.startAt} - ${viewSizeClassifier.large.endAt ?? '12'}`}{' '}
        guests
      </Button>
    </nav>
  );
}

function Button({
  children,
  isActive,
  ...props
}: { isActive: boolean } & HTMLAttributes<HTMLButtonElement>) {
  const backgroundColor = isActive ? 'bg-primary-700' : '';
  return (
    <button
      {...props}
      className={`hover:bg-primary-700 ${backgroundColor} max-w-20 px-2 py-1 hover:cursor-pointer sm:px-5 sm:py-2`}
    >
      {children}
    </button>
  );
}
