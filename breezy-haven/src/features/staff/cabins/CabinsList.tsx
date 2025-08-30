import { cabinService } from '@/services';
import { errorHelper } from '@/shared';
import { CabinAdding } from './CabinAdding';
import { CabinsTable } from './CabinsTable';

export async function CabinsList() {
  const { data, errors } = await cabinService.getAll();
  if (errors) throw errorHelper.handleError(errors);

  return (
    <>
      <CabinsTable cabins={data} />
      <CabinAdding />
    </>
  );
}
