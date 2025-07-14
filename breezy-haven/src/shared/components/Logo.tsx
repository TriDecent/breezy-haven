import Image from 'next/image';
import Link from 'next/link';

export default function Logo() {
  return (
    <Link href='/' className='z-10 flex items-center gap-4'>
      <Image
        src='/logo.png'
        height='60'
        width='60'
        alt='The Breezy Haven logo'
        priority
      />
      <span className='text-primary-100 hidden text-xl font-semibold md:block'>
        The Breezy Haven
      </span>
    </Link>
  );
}
