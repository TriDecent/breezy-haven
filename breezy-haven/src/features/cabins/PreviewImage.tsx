'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

type PreviewImageProps = {
  src: string;
  sizes?: string;
  alt: string;
  className?: string;
  fill?: boolean;
};

export default function PreviewImage({
  src,
  sizes,
  alt,
  className,
  fill,
}: PreviewImageProps) {
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  useEffect(() => {
    if (!isPreviewing) return;

    document.body.classList.add('overflow-hidden');

    return () => document.body.classList.remove('overflow-hidden');
  });

  return (
    <motion.div
      onClick={() => setIsPreviewing(state => !state)}
      className={`backdrop-blur-xs hover:cursor-pointer ${
        isPreviewing
          ? 'fixed inset-0 z-100 flex items-center justify-center p-5'
          : 'relative h-full w-full'
      }`}
    >
      {isPreviewing ? (
        <div className='relative aspect-video w-full max-w-5xl'>
          <Image
            src={src}
            sizes={sizes}
            alt={alt}
            className={className}
            fill={fill}
          />
        </div>
      ) : (
        <Image
          src={src}
          sizes={sizes}
          alt={alt}
          className={className}
          fill={fill}
        />
      )}
    </motion.div>
  );
}
