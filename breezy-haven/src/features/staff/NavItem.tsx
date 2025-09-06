import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import type { JSX } from 'react';

export function NavItem({
  href,
  icon,
  title,
  isSelected,
}: {
  href: string;
  icon: JSX.Element;
  title: string;
  isSelected: boolean;
}) {
  return (
    <Link
      href={href}
      className={`hover:bg-border relative flex justify-center rounded-md p-3 ${isSelected ? 'bg-border' : ''}`}
    >
      <p className='flex min-w-36 items-center gap-4'>
        <span>{icon}</span>
        <span>{title}</span>
      </p>
      <AnimatePresence>
        {isSelected ? (
          <motion.hr
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{ type: 'spring' }}
            className='bg-accent absolute inset-x-0 bottom-1 mx-auto h-1 w-16 rounded-full dark:h-[0.175rem]'
          />
        ) : null}
      </AnimatePresence>
    </Link>
  );
}
