'use server';

import { guestService } from '@/services';
import { ROUTES } from '@/shared/constants/ROUTES';
import { revalidatePath } from 'next/cache';
import z from 'zod';
import { Auth } from './auth';
import { getCountries } from './data-service';

export async function loginAsync(provider: 'google') {
  await Auth.nextAuth.signIn(provider);
}

export async function logoutAsync() {
  await Auth.nextAuth.signOut();
}

export async function updateProfile(
  _currentState: UpdateProfileResponse,
  formData: FormData
): Promise<UpdateProfileResponse> {
  const { main } = await Auth.getFullSessionAsync();
  if (!main)
    return {
      userEntered: null,
      errors: {
        authenticated: 'You are not authorized to perform this action',
      },
    };

  const input = Object.fromEntries(formData.entries());
  const result = safeProfileSchema.safeParse(input);

  if (!result.success) {
    const tree = z.treeifyError(result.error);
    const errors = tree.properties;

    return {
      userEntered: input,
      errors: errors ?? null,
    };
  }

  const [inputCountry, inputFlag] = result.data.nationality.split('%');
  const countries = await getCountries();
  const doesCountryExist = countries.some(
    country => country.name === inputCountry && country.flag === inputFlag
  );

  if (!doesCountryExist)
    return {
      userEntered: result.data,
      errors: {
        nationality: { errors: ['Nationality is invalid'] },
      },
    };

  await guestService.update(main.id, {
    nationality: inputCountry,
    nationalID: result.data.nationalID.toString(),
    countryFlag: inputFlag,
  });

  revalidatePath(ROUTES.account.nested.profile.href);

  return {
    userEntered: null,
    errors: null,
  };
}

const safeProfileSchema = z.object({
  nationality: z.string().min(1, { error: 'Nationality is required' }).trim(),
  nationalID: z
    .string()
    .regex(/^\d{4,11}$/, {
      error: 'National ID must be a number between 4 and 11 digits',
    })
    .transform(Number)
    .readonly(),
});

type SafeProfile = z.infer<typeof safeProfileSchema>;
type UnsafeProfile = Partial<SafeProfile>;
type UpdateProfileResponse = {
  userEntered: UnsafeProfile | null;
  errors:
    | (Partial<Record<keyof UnsafeProfile, { errors?: string[] }>> & {
        authenticated?: string;
      })
    | null;
};
