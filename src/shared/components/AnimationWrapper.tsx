'use client';

import { Variants } from '@/shared/animations';
import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

export function AnimationWrapper({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={Variants.slide.variant(0, 30)}
      initial={Variants.slide.key.hidden}
      whileInView={Variants.slide.key.visible}
      exit={Variants.slide.key.safelyHidden}
      viewport={{ amount: 0.3 }}
      transition={{ type: 'spring' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
