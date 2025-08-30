import { SideNavigation } from '@/features/staff';
import {
  MiniSidebar,
  PageLayout,
  ROUTES,
  ThemeToggle,
  Toaster,
} from '@/shared';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

export const metadata: Metadata = ROUTES.staff.metadata;

export default function StaffLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <PageLayout>
        <div className='flex flex-1'>
          <div className='hidden py-4 md:block'>
            <SideNavigation />
          </div>
          <div className='flex grow flex-col overflow-hidden'>
            <PageLayout.Header>
              <div className='flex justify-between px-4 py-4 md:py-8'>
                <p>Header</p>
                <ThemeToggle />
              </div>
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
