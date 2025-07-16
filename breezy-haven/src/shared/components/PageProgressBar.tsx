'use client';

import { useScroll, useSpring } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function PageProgressBar() {
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 15,
    mass: 1,
  });
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const unsubscribe = smoothProgress.on('change', v => {
      setProgress(Math.round(v * 100));
    });
    return unsubscribe;
  }, [smoothProgress]);

  if (progress === 0 || progress === 100) return null;

  return (
    <aside className='fixed inset-x-5 bottom-0 z-50 mx-auto'>
      <progress
        value={progress}
        max={100}
        className='[&::-webkit-progress-bar]:bg-primary-900 [&::-webkit-progress-value]:bg-accent-400 [&::-moz-progress-bar]:bg-accent-400 bg-primary-900 z-1000 h-2 w-full overflow-hidden rounded-full'
        aria-valuenow={progress}
        aria-valuemin={0}
        aria-valuemax={100}
      />
    </aside>
  );
}
