import { staffCabinService } from '@/services';

import type { Cabin } from '@/shared/schemas';
import { errorHelper } from '@/shared/utils';
import { CabinsTable } from './CabinsTable';
import type { Query } from './Operations';

export async function CabinsList({ query }: { query: Query }) {
  const { data, errors } = await staffCabinService.getAll();
  if (errors) throw errorHelper.handleError(errors);

  const cabins = filterCabinsBasedOnQuery(data, query);

  return (
    <>
      <CabinsTable cabins={[...cabins]} key={query} />
    </>
  );
}

function filterCabinsBasedOnQuery(
  cabins: readonly Cabin[],
  query: Query
): readonly Cabin[] {
  switch (query) {
    case 'all':
      return cabins;

    case 'with-discount':
      return cabins.filter(cabin => cabin.discount > 0);

    case 'no-discount':
      return cabins.filter(cabin => cabin.discount === 0);

    default:
      return cabins;
  }
}
