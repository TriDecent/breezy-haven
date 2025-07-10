'use client';

import { Bars3Icon } from '@heroicons/react/24/solid';
import { AnimatePresence, motion, useScroll } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import Variants, { slideVariantKeys } from '../animations/Variants';

export default function MiniSidebar({
  children,
}: {
  children: React.ReactNode;
}) {
  const [shouldOpenSideBar, setShouldOpenSideBar] = useState(false);
  const outsideRef = useRef<HTMLDivElement>(null);
  const lastY = useRef(0);
  const { scrollY } = useScroll();
  const [direction, setDirection] = useState<'up' | 'down'>('up');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!shouldOpenSideBar) return;
    document.addEventListener('click', handleClick);

    return () => document.removeEventListener('click', handleClick);

    function handleClick(e: PointerEvent) {
      if (outsideRef.current !== e.target) return;
      setShouldOpenSideBar(false);
    }
  }, [shouldOpenSideBar]);

  useEffect(() => {
    if (shouldOpenSideBar) return;

    const unsubscribe = scrollY.on('change', handleScroll);
    return () => unsubscribe();

    function handleScroll(y: number) {
      if (y > lastY.current && direction === 'up') setDirection('down');
      else if (y < lastY.current && direction === 'down') setDirection('up');
      lastY.current = y;
    }
  }, [scrollY, direction, shouldOpenSideBar]);

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
