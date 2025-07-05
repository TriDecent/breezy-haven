import Image from 'next/image';
import Link from 'next/link';

function Logo() {
  return (
    <Link href='/' className='z-10 flex items-center gap-4'>
      <Image
        src='/logo.png'
        height='60'
        width='60'
        alt='The Breezy Haven logo'
      />
      <span className='text-primary-100 text-xl font-semibold'>
        The Wild Oasis
      </span>
    </Link>
  );
}

export default Logo;
