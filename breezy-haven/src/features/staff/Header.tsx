import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeToggle,
} from '@/shared/components';

import { ROUTES } from '@/shared/constants';
import { LogOut, Menu, UserCircle } from 'lucide-react';
import Link from 'next/link';
import { logoutAction } from './logoutAction';
import { StaffBadge } from './StaffBadge';

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

export function SubMenu() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Menu size={32} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuItem asChild>
          <Link href={ROUTES.staff.nested.profile.href}>
            <UserCircle /> My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={logoutAction}>
          <LogOut /> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
