'use client';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components';
import { useGetStaffAuthQuery } from '@/shared/store/authApi';

export function StaffBadge() {
  const { isLoading, isError, data } = useGetStaffAuthQuery();

  return (
    <div
      className={`from-accent-100 via-primary-200 flex items-center gap-2 rounded-full bg-gradient-to-tr to-indigo-400 px-4 py-1 shadow-md md:py-2 ${isLoading || isError ? 'animate-pulse' : ''}`}
    >
      <Avatar>
        <AvatarImage
          src={data?.user.avatarUrl}
          alt='Staff avatar'
          draggable={false}
          className='object-cover object-center'
        />

        <AvatarFallback className='h-full w-full rounded-full bg-gray-500' />
      </Avatar>
      <p className='text-white text-shadow-2xs'>{data?.user.fullName}</p>
    </div>
  );
}
