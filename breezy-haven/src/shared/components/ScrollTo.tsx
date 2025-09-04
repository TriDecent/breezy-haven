'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Variants, { slideVariantKeys } from '../animations/Variants';
import useScrollDirection from '../hooks/useScrollDirection';
import { Button } from './ui/button';

export function ScrollTo({ id }: { id: string }) {
  const direction = useScrollDirection();
  return (
    <AnimatePresence>
      {direction === 'down' ? (
        <motion.aside
          variants={Variants.slideVariant(0, 50)}
          initial={slideVariantKeys.hidden}
          animate={slideVariantKeys.visible}
          exit={slideVariantKeys.safelyHidden}
          transition={{ type: 'spring' }}
        >
          <Button
            variant='ghost'
            onClick={() => {
              const element = document.querySelector(id);
              if (!element) return;

              element.scrollIntoView({ behavior: 'smooth' });
            }}
            className='aspect-square h-14 rounded-md border border-gray-600/80 text-gray-600'
          >
            <ArrowUp />
          </Button>
        </motion.aside>
      ) : null}
    </AnimatePresence>
  );
}
