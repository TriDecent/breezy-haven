'use client';
import { PriorityProvider, type Cabin } from '@/shared';
import { motion, stagger, type Variant } from 'framer-motion';
import { useEffect, useState } from 'react';
import CabinCard from './CabinCard';

export default function CabinsDisplay({ cabins }: { cabins: Cabin[] }) {
  const breakpoint = useBreakpoint();

  return cabins.length > 0 ? (
    <section>
      <motion.ul
        key={breakpoint}
        variants={myVariants}
        initial='initial'
        animate='animate'
        transition={{ type: 'spring', delayChildren: stagger(0.5) }}
        className='grid gap-8 md:grid-cols-2 lg:grid-cols-[repeat(auto-fit,_minmax(25rem,_1fr))] lg:gap-12 xl:gap-14'
      >
        {cabins.map((cabin, index) => (
          <motion.li variants={myVariants} key={`${cabin.id}`}>
            <PriorityProvider isPriority={index === 0}>
              <CabinCard cabin={cabin} />
            </PriorityProvider>
          </motion.li>
        ))}
      </motion.ul>
    </section>
  ) : null;
}

const myVariants: Record<string, Variant> = {
  initial: { opacity: 0, scale: 0.75 },
  animate: { opacity: 1, scale: 1 },
} as const;

function useBreakpoint() {
  const [breakpoint, setBreakpoint] = useState<
    'sm' | 'md' | 'lg' | 'xl' | '2xl'
  >('sm');

  useEffect(() => {
    const getBreakpoint = () => {
      const w = window.innerWidth;
      if (w >= 1536) return '2xl';
      if (w >= 1280) return 'xl';
      if (w >= 1024) return 'lg';
      if (w >= 768) return 'md';
      return 'sm';
    };

    setBreakpoint(getBreakpoint());

    const handleResize = () => setBreakpoint(getBreakpoint());

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return breakpoint;
}
