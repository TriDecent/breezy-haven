'use client';

import { Variants } from '@/shared/animations';
import {
  Button,
  ButtonGroup,
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  Overlay,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { uiActions, type RootState } from '@/shared/store';
import { InformationCircleIcon } from '@heroicons/react/24/solid';

import { AnimatePresence, motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Form from 'next/form';
import { useCallback, useState, type ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function SearchBar() {
  const [shouldDisplaySearch, setShouldDisplaySearch] =
    useState<boolean>(false);
  const dispatch = useDispatch();
  const query = useSelector((state: RootState) => state.ui.query);

  const handleSearchChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const keyword = event.target.value.toLowerCase().trim();
      dispatch(uiActions.setQuery(keyword));
    },
    [dispatch]
  );

  return (
    <AnimatePresence mode='wait'>
      {shouldDisplaySearch ? (
        <Overlay onClick={() => setShouldDisplaySearch(false)}>
          <motion.div
            variants={Variants.slide.variant(0, -30)}
            initial={Variants.slide.key.hidden}
            animate={Variants.slide.key.visible}
            exit={Variants.slide.key.safelyHidden}
            transition={{ type: 'spring' }}
            className='fixed inset-x-0 top-4 z-100 mx-auto w-fit'
          >
            <Form action={ROUTES.cabins.href} className='flex'>
              <ButtonGroup>
                <ButtonGroup className='min-w-2xs rounded backdrop-blur-xs'>
                  <InputGroup>
                    <InputGroupAddon>
                      <Search />
                    </InputGroupAddon>
                    <InputGroupInput
                      onChange={handleSearchChange}
                      defaultValue={query ?? ''}
                      name='query'
                      placeholder='Enter your keywords here...'
                      className='text-accent-300'
                    />
                    <InputGroupAddon align='inline-end'>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <InformationCircleIcon />
                        </TooltipTrigger>
                        <TooltipContent align='end' className='font-medium'>
                          Try searching using the cabin&apos;s name?
                        </TooltipContent>
                      </Tooltip>
                    </InputGroupAddon>
                  </InputGroup>
                </ButtonGroup>

                <ButtonGroup className='backdrop-blur-xs'>
                  <Button variant='outline'>
                    <Search />
                  </Button>
                </ButtonGroup>
              </ButtonGroup>
            </Form>
          </motion.div>
        </Overlay>
      ) : null}

      {!shouldDisplaySearch ? (
        <motion.aside
          key='fallback'
          variants={Variants.slide.variant(0, 30)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
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
