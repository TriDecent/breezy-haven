import type { ReactNode } from 'react';

export default function Card({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg bg-amber-100/70 p-4 shadow-xs shadow-black ${className ?? ''}`}
    >
      {children}
    </div>
  );
}
