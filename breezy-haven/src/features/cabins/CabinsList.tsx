import { cabinService } from '@/services';
// import { connection } from 'next/server';

import { errorHelper } from '@/shared';
import FilteredCabins from './FilteredCabins';

export default async function CabinsList() {
  // await connection();
  // Everything below will be excluded from prerendering

  const { data: cabins, errors } = await cabinService.getAll();

  if (errors) throw errorHelper.handleError(errors);

  return <FilteredCabins cabins={cabins} />;
}
