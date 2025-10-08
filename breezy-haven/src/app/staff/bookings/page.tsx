import {
  BookingQueries,
  BookingQuerySchema,
  BookingsList,
} from '@/features/staff/bookings';
import { Button, QueryButton, Spinner } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import { PencilLine } from 'lucide-react';

import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.bookings.metadata;

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const parsedResult = BookingQuerySchema.safeParse(await searchParams);

  return (
    <section className='space-y-6'>
      <h1 className='text-accent-500 text-2xl font-semibold tracking-widest'>
        Bookings
      </h1>

      <div className='ml-auto grid w-fit grid-cols-2 overflow-hidden rounded shadow sm:grid-cols-4 xl:grid-cols-6'>
        {BookingQueries.map(query => (
          <QueryButton
            key={query}
            queries={[{ key: 'query', value: query }]}
            isActive={
              parsedResult.success
                ? query === parsedResult.data.query
                : query === 'all'
            }
          >
            <span className='uppercase'>{query}</span>
          </QueryButton>
        ))}
      </div>

      <div className='ml-auto w-fit'>
        <Button variant='green' asChild>
          <Link
            href={
              ROUTES.staff.nested.bookings.nested['create-new-booking'].href
            }
          >
            <PencilLine /> Add A Booking
          </Link>
        </Button>
      </div>

      <Suspense fallback={<Spinner />}>
        <BookingsList
          query={parsedResult.success ? parsedResult.data.query : 'all'}
        />
      </Suspense>
    </section>
  );
}
