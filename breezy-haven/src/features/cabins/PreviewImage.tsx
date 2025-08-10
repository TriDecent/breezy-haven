'use client';

import { motion } from 'framer-motion';
import Image, { type StaticImageData } from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type PreviewImageProps = {
  src: string | StaticImageData;
  sizes?: string;
  alt: string;
  className?: string;
  fill?: boolean;
  priority?: boolean;
};

export default function PreviewImage({
  src,
  sizes,
  alt,
  className,
  fill,
  priority,
}: PreviewImageProps) {
  const [isPreviewing, setIsPreviewing] = useState<boolean>(false);

  useEffect(() => {
    if (!isPreviewing) return;

    document.body.classList.add('overflow-hidden');

    return () => document.body.classList.remove('overflow-hidden');
  });

  const handleClickOnImage = useCallback(() => {
    setIsPreviewing(state => !state);
  }, []);

  return isPreviewing ? (
    <Previewing onClick={handleClickOnImage}>
      <Image
        src={src}
        sizes={sizes}
        alt={alt}
        className={className}
        fill={fill}
        priority={priority}
      />
    </Previewing>
  ) : (
    <Normal onClick={handleClickOnImage}>
      <Image
        src={src}
        sizes={sizes}
        alt={alt}
        className={className}
        fill={fill}
        priority={priority}
      />
    </Normal>
  );
}

function Previewing({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  const [isClient, setIsClient] = useState<boolean>(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return createPortal(
    <motion.div
      onClick={onClick}
      className='fixed inset-0 z-100 flex items-center justify-center p-5 backdrop-blur-xs hover:cursor-pointer'
    >
      <div className='relative aspect-video w-full max-w-5xl'>{children}</div>,
    </motion.div>,
    document.getElementById('image-previewing')!
  );
}

function Normal({
  onClick,
  children,
}: {
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      onClick={onClick}
      className='relative h-full w-full hover:cursor-pointer'
    >
      {children}
      <div className='pointer-events-none absolute top-0 h-10 w-full bg-gradient-to-b from-slate-900 to-transparent lg:top-0 lg:bottom-0 lg:left-0 lg:h-full lg:w-6 lg:bg-gradient-to-r'></div>
      <div className='pointer-events-none absolute bottom-0 h-10 w-full bg-gradient-to-t from-slate-900 to-transparent lg:top-0 lg:right-0 lg:bottom-0 lg:h-full lg:w-6 lg:bg-gradient-to-l'></div>
    </motion.div>
  );
}
