import {
  BookingQuerySchema,
  bookingTimeFrames,
  DataOverview,
} from '@/features/staff/dashboard';
import { QueryButton, Spinner } from '@/shared/components';
import { ROUTES } from '@/shared/constants';
import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.dashboard.metadata;

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<unknown>;
}) {
  const parsed = BookingQuerySchema.safeParse(await searchParams);
  let query = 7;
  if (parsed.success) query = parsed.data.last;

  return (
    <section className='space-y-8'>
      <h1 className='text-accent-500 text-2xl font-semibold tracking-widest'>
        Dashboard
      </h1>

      <div className='border-border/50 ml-auto w-fit overflow-hidden rounded border shadow'>
        {bookingTimeFrames.map(frame => (
          <QueryButton
            queries={[{ key: 'last', value: frame.toString() }]}
            isActive={query === frame}
            key={frame}
          >
            {frame} days
          </QueryButton>
        ))}
      </div>

      <Suspense fallback={<Spinner />}>
        <DataOverview queryDays={query} />
      </Suspense>
    </section>
  );
}
