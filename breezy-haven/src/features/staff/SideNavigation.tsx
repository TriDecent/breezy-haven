import breezyHavenLogo from '@/../public/logo.png';
import { ROUTES } from '@/shared';

import Image from 'next/image';
import { NavItem } from './NavItem';

export function SideNavigation() {
  return (
    <div className='sticky top-0 hidden h-fit py-4 md:block'>
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
              <NavItem href={route.href} title={route.metadata.title} />
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
