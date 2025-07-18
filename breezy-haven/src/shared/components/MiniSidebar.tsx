'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Variants, { slideVariantKeys } from '../animations/Variants';
import useScrollDirection from '../hooks/useScrollDirection';

export default function MiniSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldOpenSideBar, setShouldOpenSideBar] = useState(false);
  const outsideRef = useRef<HTMLDivElement>(null);
  const direction = useScrollDirection();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!shouldOpenSideBar) return;
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);

    function handleClick(e: MouseEvent) {
      if (outsideRef.current !== e.target) return;
      setShouldOpenSideBar(false);
    }
  }, [shouldOpenSideBar]);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return isMounted
    ? createPortal(
        <AnimatePresence mode='wait'>
          {direction === 'up' && !shouldOpenSideBar ? (
            <motion.button
              key='bar3'
              variants={Variants.slideVariant(0, 30)}
              initial={slideVariantKeys.hidden}
              animate={slideVariantKeys.visible}
              exit={slideVariantKeys.safelyHidden}
              transition={{ type: 'spring' }}
              onClick={() => setShouldOpenSideBar(true)}
              className='bg-primary-950 fixed right-6 bottom-8 rounded-full p-4 shadow-md shadow-black'
            >
              <Bars3Icon className='w-8' />
            </motion.button>
          ) : null}

          {shouldOpenSideBar ? (
            <motion.div
              key='sidebar'
              variants={Variants.slideVariant(-30, 0)}
              initial={slideVariantKeys.hidden}
              animate={slideVariantKeys.visible}
              exit={slideVariantKeys.safelyHidden}
              transition={{ type: 'spring' }}
              ref={outsideRef}
              className='fixed inset-x-0 inset-y-0 z-1000 backdrop-blur-xs'
            >
              <div className='bg-primary-950 pointer-events-auto h-full w-2/3 py-4'>
                {children}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>,
        document.getElementById('mini-sidebar')!
      )
    : null;
}
