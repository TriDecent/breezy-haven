'use cache';
import { NotFound } from '@/shared/components';
import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for does not exist.',
};

export default async function RootNotFound() {
  cacheLife('default-strategy');
  return (
    <div className='flex min-h-screen items-center'>
      <NotFound />
    </div>
  );
}
