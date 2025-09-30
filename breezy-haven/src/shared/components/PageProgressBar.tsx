'use client';

import { useScrollProgress } from '../hooks/use-scroll-progress';

export default function PageProgressBar() {
  const progress = useScrollProgress();

  if (progress === 0 || progress === 100) return null;

  return (
    <aside className='fixed inset-x-5 bottom-0 z-50 mx-auto'>
      <progress
        value={progress}
        max={100}
        className='[&::-webkit-progress-bar]:bg-background/50 [&::-webkit-progress-value]:bg-accent-400 [&::-moz-progress-bar]:bg-accent-400 z-1000 h-2 w-full overflow-hidden rounded-full shadow'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </aside>
  );
}
