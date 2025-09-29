'use client';

import { slideVariantKeys, Variants } from '@/shared/animations';
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
      variants={Variants.slideVariant(0, 30)}
      initial={slideVariantKeys.hidden}
      whileInView={slideVariantKeys.visible}
      viewport={{ amount: 0.3 }}
      exit={slideVariantKeys.safelyHidden}
      transition={{ type: 'spring' }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
