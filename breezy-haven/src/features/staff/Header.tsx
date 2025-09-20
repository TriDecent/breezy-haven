import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  ThemeToggle,
} from '@/shared/components';

import { LogOut, Menu } from 'lucide-react';
import { logoutAction } from './logoutAction';

export function Header() {
  return (
    <div className='flex justify-between px-4 py-4 md:py-8'>
      <p>Avatar and badge here</p>
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
        <DropdownMenuItem asChild></DropdownMenuItem>
        <DropdownMenuItem onClick={logoutAction}>
          <LogOut /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
