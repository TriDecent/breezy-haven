import { SideNavigation } from '@/features/account';
import { MiniSidebar } from '@/shared';

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <nav className='grid grid-cols-1 md:grid-cols-[16rem_1fr]'>
      <div className='hidden md:block'>
        <SideNavigation />
      </div>
      <div>{children}</div>

      <MiniSidebar>
        <SideNavigation />
      </MiniSidebar>
    </nav>
  );
}
