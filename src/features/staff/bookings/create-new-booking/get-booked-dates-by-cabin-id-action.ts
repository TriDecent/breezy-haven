'use server';

import { staffBookingService } from '@/services';
import { errorHelper } from '@/shared/utils';

export async function getBookedDatesByCabinIdAction(cabinId: number) {
  const result = await staffBookingService.getBookedDatesByCabinId(cabinId);

  if (result.errors) throw errorHelper.handleError(result.errors);

  return result.data;
}
