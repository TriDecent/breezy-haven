import defaultUser from '@/../public/default-user.png';
import Image from 'next/image';

export default function Badge({
  avatarSrc,
  name,
}: {
  avatarSrc?: string | null;
  name?: string | null;
}) {
  return (
    <div className='bg-accent-700/40 flex items-center gap-2 rounded-full px-3 py-1 shadow-sm'>
      <Image
        src={avatarSrc ?? defaultUser}
        referrerPolicy='no-referrer'
        width={28}
        height={28}
        alt='user avatar'
        className='ring-accent-500 rounded-full object-cover object-center ring'
      />
      <span className='font-semibold'>{name}</span>
    </div>
  );
}
