'use client';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { motion, stagger } from 'framer-motion';
import { notFound, useSearchParams } from 'next/navigation';
import CabinCard from './CabinCard';
import { cabinCapacities, viewSizeClassifier } from './sizeClassifier';

import { useEffect, useState } from 'react';

export default function FilteredCabins({
  cabins,
}: {
  cabins: NonNullableObject<DTOCabin>[];
}) {
  const breakpoint = useBreakpoint();

  const params = useSearchParams();
  const capacity = params.get('capacity') ?? 'all';

  if (!cabinCapacities.includes(capacity)) notFound();

  const filteredCabins = filterCabinsBasedOnCapacity(
    capacity,
    cabins as NonNullableObject<DTOCabin>[]
  );

  return filteredCabins.length > 0 ? (
    <section>
      <motion.ul
        key={breakpoint}
        variants={myVariants}
        initial='initial'
        animate='animate'
        transition={{ type: 'spring', delayChildren: stagger(0.5) }}
        className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'
      >
        {filteredCabins.map((cabin, index) => (
          <motion.li variants={myVariants} key={`${cabin.id}-${capacity}`}>
            <CabinCard cabin={cabin} isFirstCabin={index === 0} />
          </motion.li>
        ))}
      </motion.ul>
    </section>
  ) : null;
}
const myVariants = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
};

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<'sm' | 'md' | 'lg'>('sm');

  useEffect(() => {
    const getBreakpoint = () => {
      const w = window.innerWidth;
      if (w >= 1024) return 'lg';
      if (w >= 768) return 'md';
      return 'sm';
    };

    setBreakpoint(getBreakpoint());

    const handleResize = () => {
      setBreakpoint(getBreakpoint());
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
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
