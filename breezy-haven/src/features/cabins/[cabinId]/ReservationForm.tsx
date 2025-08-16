'use client';

import {
  Badge,
  PrimaryButton,
  ROUTES,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  useGetAuthQuery,
  type Cabin,
} from '@/shared';
import Link from 'next/link';

import { useEffect, useState } from 'react';

export default function ReservationForm({ cabin }: { cabin: Cabin }) {
  const [guestCount, setGuestCount] = useState<number>(0);
  const { data, isFetching } = useGetAuthQuery();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => setIsMounted(true), []);

  return (
    <article className='h-fit shadow-lg lg:order-2'>
      <div className='bg-primary-800 text-primary-300 flex items-center justify-between rounded-t-lg px-8 py-4 lg:px-16'>
        {!isMounted ? (
          <div className='h-8 w-8 animate-pulse rounded-full bg-gray-300' />
        ) : isFetching ? (
          <div className='h-8 w-8 animate-pulse rounded-full bg-gray-300' />
        ) : data ? (
          <>
            <p>Logged in as</p>
            <Badge avatarSrc={data.user?.image} name={data.user?.name} />
          </>
        ) : (
          <p>You haven&apos;t logged in yet</p>
        )}
      </div>

      <form className='bg-primary-900 flex flex-col gap-5 rounded-b-lg px-4 py-5 text-lg sm:px-8 md:py-10 xl:px-16'>
        <div className='space-y-2'>
          <label htmlFor='guestCount'>How many guests?</label>
          <Select
            name='guestCount'
            value={`${guestCount === 0 ? '' : guestCount}`}
            onValueChange={value => setGuestCount(Number(value))}
          >
            <SelectTrigger id='guestCount' className='w-full'>
              <SelectValue placeholder='Select number of guests' />
            </SelectTrigger>
            <SelectContent align='start'>
              {Array.from({ length: cabin.maxCapacity }, (_, i) => i + 1).map(
                x => (
                  <SelectItem key={x} value={`${x}`}>
                    {x} {x === 1 ? 'guest' : 'guests'}
                  </SelectItem>
                )
              )}
            </SelectContent>
          </Select>
        </div>

        <div className='space-y-2'>
          <label htmlFor='observations'>
            Anything we should know about your stay?
          </label>
          <Textarea
            name='observations'
            id='observations'
            placeholder='Any pets, allergies, special requirements, etc.?'
          />
        </div>

        <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-end'>
          <div className='w-full lg:order-2'>
            {!isMounted ? (
              <Link
                href={`${ROUTES.login.href}`}
                className='flex w-full justify-center'
              >
                <p>
                  <span className='text-accent-500 underline'>Sign in</span> to
                  reserve the cabin
                </p>
              </Link>
            ) : data?.isAuthenticated ? (
              <PrimaryButton>Reserve now</PrimaryButton>
            ) : (
              <Link
                href={`${ROUTES.login.href}`}
                className='flex w-full justify-center'
              >
                <p>
                  <span className='text-accent-500 underline'>Sign in</span> to
                  reserve the cabin
                </p>
              </Link>
            )}
          </div>
          <p className='text-muted-foreground self-center text-base lg:order-1'>
            Start by selecting dates
          </p>
        </div>
      </form>
    </article>
  );
}
