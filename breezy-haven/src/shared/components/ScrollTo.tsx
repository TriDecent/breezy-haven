'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import Variants from '../animations/Variants';
import useScrollDirection from '../hooks/useScrollDirection';
import { Button } from './ui/button';

export function ScrollTo({ id }: { id: string }) {
  const direction = useScrollDirection();
  return (
    <AnimatePresence>
      {direction === 'down' ? (
        <motion.aside
          variants={Variants.slide.variant(0, 50)}
          initial={Variants.slide.key.hidden}
          animate={Variants.slide.key.visible}
          exit={Variants.slide.key.safelyHidden}
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
