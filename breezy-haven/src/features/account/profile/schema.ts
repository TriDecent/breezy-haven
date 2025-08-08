import z from 'zod';

export const guestFormSchema = z.object({
  email: z.email(),
  fullName: z.string(),
  nationality: z.string().nullable(),
  nationalID: z.string().nullable(),
  countryFlag: z.string().nullable(),
});

export type GuestForm = z.infer<typeof guestFormSchema>;
