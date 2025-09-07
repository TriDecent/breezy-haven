import { staffCabinService } from '@/services';
import { errorHelper, type Cabin } from '@/shared';
import { CabinModal } from './CabinModal';
import { CabinOperations } from './CabinOperations';
import { CabinsTable } from './CabinsTable';
import type { Query } from './Operations';

export async function CabinsList({ query }: { query: Query }) {
  const { data, errors } = await staffCabinService.getAll();
  if (errors) throw errorHelper.handleError(errors);

  const cabins = filterCabinsBasedOnQuery(data, query);

  return (
    <>
      <CabinOperations />
      <CabinsTable cabins={[...cabins]} key={query} />
      <CabinModal />
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
