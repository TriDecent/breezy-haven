'use client';
import { createContext, type ReactNode } from 'react';

export const PriorityContext = createContext(false);

export default function PriorityProvider({
  children,
  isPriority,
}: {
  children: ReactNode;
  isPriority: boolean;
}) {
  return <PriorityContext value={isPriority}>{children}</PriorityContext>;
}
