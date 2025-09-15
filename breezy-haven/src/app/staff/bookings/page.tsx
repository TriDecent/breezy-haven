import {
  BookingQueries,
  BookingQuerySchema,
  BookingsList,
} from '@/features/staff/bookings';
import { QueryButton, ROUTES, Spinner } from '@/shared';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.bookings.metadata;

export default async function BookingsPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  // TODO: verify staff authentication
  const parsedResult = BookingQuerySchema.safeParse(await searchParams);

  return (
    <section className='space-y-4'>
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

      <Suspense fallback={<Spinner />}>
        <BookingsList
          query={parsedResult.success ? parsedResult.data.query : 'all'}
        />
      </Suspense>
    </section>
  );
}
