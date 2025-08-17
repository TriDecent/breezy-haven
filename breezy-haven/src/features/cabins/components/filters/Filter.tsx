'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { HTMLAttributes, useCallback } from 'react';
import { ViewSizeClassifier, type CabinQuery } from '../constants/SizeClassifier';


export default function Filter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const capacityQuery = searchParams.get('capacity') ?? 'all';

  const handleFilter = useCallback(
    (filter: CabinQuery['capacity']): void => {
      const otherParams = Object.fromEntries(searchParams.entries());
      const params = new URLSearchParams({ ...otherParams });
      params.set('capacity', filter);

      window.history.pushState(null, '', `${pathname}?${params.toString()}`);
    },
    [pathname, searchParams]
  );

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
        {`${ViewSizeClassifier.small.startAt} - ${ViewSizeClassifier.small.endAt}`}{' '}
        guests
      </Button>
      <Button
        isActive={capacityQuery === 'medium'}
        onClick={() => handleFilter('medium')}
      >
        {' '}
        {`${ViewSizeClassifier.medium.startAt} - ${ViewSizeClassifier.medium.endAt}`}{' '}
        guests
      </Button>
      <Button
        isActive={capacityQuery === 'large'}
        onClick={() => handleFilter('large')}
      >
        {' '}
        {`${ViewSizeClassifier.large.startAt} - ${ViewSizeClassifier.large.endAt ?? '12'}`}{' '}
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
