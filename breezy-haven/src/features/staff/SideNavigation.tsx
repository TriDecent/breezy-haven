'use client';
import breezyHavenLogo from '@/../public/logo.png';
import { ROUTES } from '@/shared';
import {
  CalendarIcon,
  HomeIcon,
  HomeModernIcon,
  UserIcon,
} from '@heroicons/react/24/solid';

import { SettingsIcon } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { NavItem } from './NavItem';

const Icons = {
  [ROUTES.staff.nested.dashboard.metadata.title]: <HomeIcon width={24} />,
  [ROUTES.staff.nested.bookings.metadata.title]: <CalendarIcon width={24} />,
  [ROUTES.staff.nested.cabins.metadata.title]: <HomeModernIcon width={24} />,
  [ROUTES.staff.nested.user.metadata.title]: <UserIcon width={24} />,
  [ROUTES.staff.nested.settings.metadata.title]: <SettingsIcon width={24} />,
} as const;

export function SideNavigation() {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(segment => segment);
  const currentSegment =
    segments.length === 2 && segments.pop()?.trim().toLowerCase();

  return (
    <div className='sticky top-0 h-fit py-4'>
      <div className='flex flex-col items-center gap-1'>
        <Image
          src={breezyHavenLogo}
          width={69}
          height={69}
          alt='The Breezy Haven logo'
          priority
        />
        <p>The Breezy Haven</p>
      </div>
      <nav className='mt-4 p-4'>
        <ul className='flex flex-col gap-6'>
          {Object.values(ROUTES.staff.nested).map(route => (
            <li key={route.href}>
              <NavItem
                href={route.href}
                icon={Icons[route.metadata.title]}
                title={route.metadata.title}
                isSelected={
                  currentSegment === route.metadata.title.toLowerCase().trim()
                }
              />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
