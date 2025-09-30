import { ThemeToggle } from '@/shared/components';
import { StaffBadge } from './StaffBadge';
import { SubMenu } from './SubMenu';

export function Header() {
  return (
    <div className='flex justify-between px-4 py-4 md:py-8'>
      <StaffBadge />

      <div className='flex items-center gap-4'>
        <SubMenu />
        <ThemeToggle />
      </div>
    </div>
  );
}
