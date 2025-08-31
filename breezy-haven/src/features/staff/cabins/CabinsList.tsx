import { staffCabinService } from '@/services';
import { errorHelper } from '@/shared';
import { CabinAdding } from './CabinAdding';
import { CabinsTable } from './CabinsTable';

export async function CabinsList() {
  const { data, errors } = await staffCabinService.getAll();
  if (errors) throw errorHelper.handleError(errors);

  return (
    <>
      <CabinAdding />
      <CabinsTable cabins={data} />
    </>
  );
}
