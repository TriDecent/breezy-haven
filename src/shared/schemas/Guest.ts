import { z } from 'zod';

export const GuestSchema = z.object({
  countryFlag: z.string({ error: 'countryFlag must be a string' }),
  created_at: z.string({ error: 'created_at must be a string' }),
  email: z.string({ error: 'email must be a string' }),
  fullName: z.string({ error: 'fullName must be a string' }),
  id: z.coerce.number({ error: 'id must be a number' }),
  nationalID: z.string({ error: 'nationalID must be a string' }),
  nationality: z.string({ error: 'nationality must be a string' }),
});
export const NullableGuestSchema = z.object({
  countryFlag: z.string({ error: 'countryFlag must be a string' }).nullable(),
  created_at: z.string({ error: 'created_at must be a string' }),
  email: z.string({ error: 'email must be a string' }).nullable(),
  fullName: z.string({ error: 'fullName must be a string' }).nullable(),
  id: z.coerce.number({ error: 'id must be a number' }),
  nationalID: z.string({ error: 'nationalID must be a string' }).nullable(),
  nationality: z.string({ error: 'nationality must be a string' }).nullable(),
});

export type Guest = z.infer<typeof GuestSchema>;
export type NullableGuest = z.infer<typeof NullableGuestSchema>;
