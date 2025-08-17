'use client';
import {
  fromISOToDateRange,
  RootState,
  slideVariantKeys,
  useScrollDirection,
  Variants,
} from '@/shared';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { format } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import { useSelector } from 'react-redux';

export default function ReservationReminder() {
  const isoRange = useSelector((state: RootState) => state.ui.isoDateRange);
  const dateRange = isoRange ? fromISOToDateRange(isoRange) : undefined;
  const direction = useScrollDirection();
  const [shouldDisplay, setShouldDisplay] = useState<boolean>(true);

  if (!dateRange?.from || !dateRange?.to) return null;

  return (
    <AnimatePresence>
      {direction === 'up' && shouldDisplay ? (
        <motion.aside
          variants={Variants.slideVariant(0, 30)}
          initial={slideVariantKeys.hidden}
          animate={slideVariantKeys.visible}
          exit={slideVariantKeys.safelyHidden}
          transition={{ type: 'tween', duration: 0.35 }}
          className='bg-accent-500 text-primary-800 gap fixed inset-x-0 bottom-6 mx-auto flex w-fit items-center rounded px-4 py-2 font-semibold shadow-xl shadow-slate-900 md:rounded-full md:px-8 md:py-5'
        >
          <p>
            <span>👋</span> Don&apos;f forget to reserve your dates <br /> from{' '}
            {format(new Date(dateRange.from), 'MMM dd yyyy')} to{' '}
            {format(new Date(dateRange.to), 'MMM dd yyyy')}
          </p>
          <button
            onClick={() => setShouldDisplay(false)}
            className='hover:bg-accent-600 rounded-full p-1 transition-all'
          >
            <XMarkIcon className='h-5 w-5' />
          </button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
