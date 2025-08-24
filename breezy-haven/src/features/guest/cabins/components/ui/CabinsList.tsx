import { cabinService } from '@/services';
// import { connection } from 'next/server';

import { errorHelper } from '@/shared';
import QueryCabins from './QueryCabins';

export default async function CabinsList() {
  // await connection();
  // Everything below will be excluded from prerendering

  const { data: cabins, errors } = await cabinService.getAll();

  if (errors) throw errorHelper.handleError(errors);

  return <QueryCabins cabins={cabins} />;
}
