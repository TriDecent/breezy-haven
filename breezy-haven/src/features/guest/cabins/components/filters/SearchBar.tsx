'use client';

import { slideVariantKeys, Variants } from '@/shared/animations';
import { Button, Input } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { useScrollDirection } from '@/shared/hooks';
import { uiActions, type RootState } from '@/shared/store';
import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Form from 'next/form';
import { useCallback, useEffect, useState, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function SearchBar() {
  const [shouldDisplaySearch, setShouldDisplaySearch] =
    useState<boolean>(false);
  const direction = useScrollDirection();
  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.ui.query);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const keyword = event.target.value.toLowerCase().trim();
      dispatch(uiActions.setQuery(keyword));
    },
    [dispatch]
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
              defaultValue={query ?? ''}
              name='query'
              placeholder='Enter your keywords here...'
              className='text-accent-300 w-full'
            />
          </Form>
        </motion.div>
      ) : null}

      {!shouldDisplaySearch ? (
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
            className='h-16 w-16 rounded-full p-0 shadow-sm shadow-black'
          >
            <Search size={36} />
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
