import { NotFound } from '@/shared/components';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page not found',
  description: 'The page you are looking for does not exist.',
};

export default function RootNotFound() {
  return (
    <div className='flex min-h-screen items-center'>
      <NotFound />
    </div>
  );
}
