import breezyHavenLogo from '@/../public/logo.png';
import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '../constants/routes';
import { Shimmer } from './Shimmer';

export default function Logo() {
  return (
    <Link href={`${ROUTES.home.href}`} className='z-10 flex items-center gap-4'>
      <Image
        src={breezyHavenLogo}
        width={50}
        height={50}
        alt='The Breezy Haven logo'
        priority
      />
      <Shimmer className='hidden text-xl font-semibold md:block'>
        The Breezy Haven
      </Shimmer>
    </Link>
  );
}
