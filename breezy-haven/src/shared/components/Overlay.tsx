'use client';

import { useRef, type ReactNode } from 'react';

export function Overlay({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: () => void;
}) {
  const overlayRef = useRef<HTMLDivElement | null>(null);

  return (
    <div
      ref={overlayRef}
      className='fixed inset-0'
      onClick={e => {
        if (e.target !== overlayRef.current) return;
        onClick();
      }}
    >
      {children}
    </div>
  );
}
