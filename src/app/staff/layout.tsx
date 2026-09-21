'use cache';
import { Header, SideNavigation } from '@/features/staff';
import { MiniSidebar, PageLayout, Toaster } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

import type { Metadata } from 'next';
import { cacheLife } from 'next/cache';
import type { ReactNode } from 'react';

export const metadata: Metadata = ROUTES.staff.metadata;

export default async function StaffLayout({
  children,
}: {
  children: ReactNode;
}) {
  cacheLife('default-strategy');

  return (
    <>
      <PageLayout>
        <div className='flex flex-1'>
          <div className='hidden md:block'>
            <SideNavigation />
          </div>

          <div className='flex grow flex-col overflow-hidden'>
            <PageLayout.Header>
              <Header />
            </PageLayout.Header>
            <PageLayout.Main>{children}</PageLayout.Main>
          </div>
        </div>
        <PageLayout.Footer />
      </PageLayout>
      <MiniSidebar>
        <SideNavigation />
      </MiniSidebar>
      <Toaster richColors position='top-right' />
    </>
  );
}
