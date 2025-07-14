'use client';

import { motion } from 'framer-motion';

export default function CabinCardSkeleton() {
  return (
    <article className='border-primary-800 flex animate-pulse flex-col overflow-hidden rounded-md border lg:flex-row'>
      <div className='relative h-48 overflow-hidden bg-slate-300 lg:h-auto lg:w-42'>
        <motion.div
          className='absolute inset-0 z-100 bg-gradient-to-r from-transparent via-white to-transparent'
          initial={{ translateX: '-100%' }}
          animate={{ translateX: '100%' }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeOut' }}
        />
      </div>

      <div className='flex-1'>
        <div className='bg-primary-950 space-y-4 px-7 pt-5 pb-4'>
          <div className='h-6 w-3/4 rounded bg-slate-300' />
          <div className='flex items-center gap-3'>
            <div className='h-5 w-5 rounded-full bg-slate-300' />
            <div className='h-5 w-1/2 rounded bg-slate-300' />
          </div>
          <div className='ml-auto h-6 w-1/3 rounded bg-slate-300' />
        </div>

        <div className='bg-primary-950 border-t-primary-800 border-t px-6 py-4 text-right'>
          <div className='ml-auto h-4 w-2/3 rounded bg-slate-300' />
        </div>
      </div>
    </article>
  );
}
