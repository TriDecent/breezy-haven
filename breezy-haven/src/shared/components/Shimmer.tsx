'use client';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export function Shimmer({
  children,
  className,
}: {
  children: string;
  className?: string;
}) {
  return (
    <motion.span
      className={cn(
        className,
        'from-primary via-accent to-primary bg-gradient-to-r bg-size-[200%] bg-clip-text text-transparent'
      )}
      animate={{
        backgroundPosition: ['200%', '-200%'],
        opacity: [0.5, 0.75, 1, 1, 0.75, 0.5],
      }}
      transition={{ repeat: Infinity, duration: 4 }}
    >
      {children}
    </motion.span>
  );
}
