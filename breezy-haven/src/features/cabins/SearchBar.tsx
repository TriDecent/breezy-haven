'use client';

import {
  Button,
  Input,
  ROUTES,
  slideVariantKeys,
  useScrollDirection,
  Variants,
} from '@/shared';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Form from 'next/form';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';

export default function SearchBar() {
  const [shouldDisplaySearch, setShouldDisplaySearch] =
    useState<boolean>(false);
  const direction = useScrollDirection();
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const searchParams = useSearchParams();

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (debounceTimeout) clearTimeout(debounceTimeout);
      const keyword = event.target.value.toLowerCase();

      const timeout = setTimeout(() => {
        const otherParams = Object.fromEntries(searchParams.entries());
        const aggregatedParams = new URLSearchParams({
          query: keyword,
          ...otherParams,
        });

        window.history.pushState(
          null,
          '',
          new URL(
            `${ROUTES.cabins.href}?${aggregatedParams.toString()}`,
            window.location.origin
          )
        );
      }, 300);

      setDebounceTimeout(timeout);
    },
    [debounceTimeout, searchParams]
  );

  useEffect(() => {
    if (direction === 'up') setShouldDisplaySearch(false);
  }, [direction]);

  return (
    <AnimatePresence mode='wait'>
      {shouldDisplaySearch ? (
        <motion.div
          variants={Variants.slideVariant(0, -30)}
          initial={slideVariantKeys.hidden}
          animate={slideVariantKeys.visible}
          exit={slideVariantKeys.safelyHidden}
          transition={{ type: 'spring' }}
          className='fixed inset-x-0 top-4 z-100 mx-auto w-fit min-w-2xs backdrop-blur-md'
        >
          <Form action={ROUTES.cabins.href} className='flex'>
            <Input
              onChange={handleSearchChange}
              name='query'
              placeholder='Enter your keywords here...'
              className='text-accent-300 w-full'
            />
          </Form>
        </motion.div>
      ) : null}

      {!shouldDisplaySearch && direction === 'down' ? (
        <motion.aside
          key='fallback'
          variants={Variants.slideVariant(0, 30)}
          initial={slideVariantKeys.hidden}
          animate={slideVariantKeys.visible}
          exit={slideVariantKeys.safelyHidden}
          className='fixed bottom-16'
        >
          <Button
            onClick={() => setShouldDisplaySearch(state => !state)}
            className='h-16 w-16 rounded-full'
          >
            <Search size={36} />
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
