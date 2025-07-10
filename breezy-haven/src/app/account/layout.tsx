import { SideNavigation } from '@/features/account';
import { MiniSidebar } from '@/shared';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s - Account | The Breezy Haven',
    default: 'Account',
  },
};

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className='grid flex-1 grid-cols-1 md:grid-cols-[16rem_1fr]'>
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
