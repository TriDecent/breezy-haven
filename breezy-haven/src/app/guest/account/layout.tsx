import { SideNavigation } from '@/features/guest/account';
import { MiniSidebar, ROUTES } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = ROUTES.account.metadata;

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
