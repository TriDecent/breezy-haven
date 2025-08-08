import { cabinService } from '@/services';
// import { connection } from 'next/server';

import { DTOCabin, NonNullableObject } from '@/repositories';
import { notFound } from 'next/navigation';
import FilteredCabins from './FilteredCabins';

export default async function CabinsList() {
  // await connection();
  // Everything below will be excluded from prerendering

  const { data: cabins, error } = await cabinService.getAll();

  if (error) throw new Error(`${error.code}: ${error.message}`);

  if (!cabins) notFound();

  return <FilteredCabins cabins={cabins as NonNullableObject<DTOCabin>[]} />;
}
