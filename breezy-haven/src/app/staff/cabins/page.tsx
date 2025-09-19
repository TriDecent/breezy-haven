import {
  CabinModal,
  CabinOperations,
  QuerySchema,
  type Query,
} from '@/features/staff/cabins';
import { CabinsList } from '@/features/staff/cabins/CabinsList';
import { Spinner } from '@/shared/components';
import { ROUTES } from '@/shared/constants';

import type { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = ROUTES.staff.nested.cabins.metadata;

export default async function CabinsPage({
  searchParams,
}: {
  searchParams: Promise<Record<'query', Query>>;
}) {
  const query = (await searchParams).query;

  const parsedQueryResult = QuerySchema.safeParse(query);
  const parsedQuery = parsedQueryResult.success
    ? parsedQueryResult.data
    : 'all';

  return (
    <section>
      <h1 className='text-accent-500 mb-4 text-2xl font-semibold tracking-widest'>
        All cabins
      </h1>

      <CabinModal />
      <CabinOperations />
      <Suspense fallback={<Spinner />}>
        <CabinsList query={parsedQuery} />
      </Suspense>
    </section>
  );
}
