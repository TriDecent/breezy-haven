'use cache';
import { SideNavigation } from '@/features/guest/account';
import { MiniSidebar } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

import { Metadata } from 'next';
import { cacheLife } from 'next/cache';

export const metadata: Metadata = ROUTES.account.metadata;

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  cacheLife('default-strategy');
  return (
    <div className='grid flex-1 grid-cols-1 md:grid-cols-[12rem_1fr] lg:grid-cols-[16rem_1fr]'>
      <section className='hidden md:block'>
        <SideNavigation />
      </section>
      <section className='p-4'>{children}</section>

      <MiniSidebar>
        <SideNavigation />
      </MiniSidebar>
    </div>
  );
}
