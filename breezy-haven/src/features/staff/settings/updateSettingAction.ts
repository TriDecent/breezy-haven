'use server';

import { Auth } from '@/lib';
import { staffSettingService } from '@/services';
import type { ActionResponse } from '@/shared/actions';
import { ROUTES } from '@/shared/constants';
import { SettingSchema, type Setting } from '@/shared/schemas';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const UpdateSettingSchema = SettingSchema.omit({
  created_at: true,
});
type SafeUpdateUpdateSettingInput = z.infer<typeof UpdateSettingSchema>;

export type UpdateSettingResponse = ActionResponse<
  Partial<Record<keyof SafeUpdateUpdateSettingInput, string>>,
  Partial<
    Record<keyof SafeUpdateUpdateSettingInput, string[]> & {
      unexpected: string[];
    }
  >
>;

export async function updateSettingAction(
  state: UpdateSettingResponse,
  formData: FormData
): Promise<UpdateSettingResponse> {
  await Auth.staff.ensureStaffIsAuthenticatedAsync();

  const input = Object.fromEntries(formData.entries());

  const parsedResult = UpdateSettingSchema.safeParse(input);

  if (!parsedResult.success) {
    const errors = z.flattenError(parsedResult.error).fieldErrors;

    return {
      userEntered: input,
      errors,
    };
  }

  const [isFailed] = await updateSettingAsync(parsedResult.data);

  if (isFailed)
    return {
      userEntered: input,
      errors: {
        unexpected: ['An error has occurred while trying to update settings'],
      },
    };

  revalidatePath(ROUTES.staff.nested.settings.href);

  return {
    userEntered: null,
    errors: null,
    isSuccess: true,
  };
}

async function updateSettingAsync(
  setting: Omit<Setting, 'created_at'>
): Promise<[isFailed: boolean]> {
  const { id, ...rest } = setting;
  const { errors } = await staffSettingService.update(id, { ...rest });

  if (errors) return [true];

  return [false];
}
