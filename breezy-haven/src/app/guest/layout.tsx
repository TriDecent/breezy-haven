import {
  Logo,
  Navigation,
  NavTrail,
  PageLayout,
  ThemeToggle,
  Toaster,
} from '@/shared/components';
import { ROUTES } from '@/shared/constants';

import '@/styles/globals.css';
import { Metadata } from 'next';

export const metadata: Metadata = ROUTES.home.metadata;

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageLayout>
      <PageLayout.Header>
        <div className='mx-auto flex items-center justify-between p-2 md:p-6 lg:p-8'>
          <Logo />
          <Navigation />
          <ThemeToggle />
        </div>
        <div className='px-4 md:px-8 lg:px-12'>
          <NavTrail />
        </div>
      </PageLayout.Header>
      <PageLayout.Main>{children}</PageLayout.Main>
      <PageLayout.Footer />
      <Toaster richColors position='top-center' />
    </PageLayout>
  );
}
