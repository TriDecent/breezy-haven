import { z } from 'zod';

export const CabinSchema = z.object({
  created_at: z.string({ error: 'CreatedAt must be a string' }),
  description: z
    .string({ error: 'Description must be a string' })
    .min(10, { error: 'Description must be at least 10 characters ' })
    .max(1000, { error: 'Description cannot exceed 1000 characters' }),
  discount: z.coerce
    .number({ error: 'Discount must be a number' })
    .refine(val => val >= 0 && val <= 100, {
      message: 'Discount must be between 0 and 100',
    }),
  id: z.coerce
    .number({ error: 'Id must be a number' })
    .positive({ error: 'Id must be a positive number' }),
  image: z.url({ error: 'Image must be URL' }),
  maxCapacity: z.coerce
    .number({ error: 'Capacity must be a number' })
    .positive({ message: 'Capacity must be a positive number' }),
  name: z
    .string({ error: 'Name must be a string' })
    .min(3, { error: 'Name must be at least 3 characters' }),
  regularPrice: z.coerce
    .number({ error: 'Price must be a number' })
    .positive({ message: 'Price must be a positive number' }),
});
export const NullableCabinSchema = z.object({
  created_at: z.string({ error: 'CreatedAt must be a string' }),
  description: z.string({ error: 'Description must be a string' }).nullable(),
  discount: z.coerce.number({ error: 'Discount must be a number' }).nullable(),
  id: z.coerce.number({ error: 'Id must be a number' }),
  image: z.url({ error: 'Image must be a string' }).nullable(),
  maxCapacity: z.coerce
    .number({ error: 'MaxCapacity must be a number' })
    .nullable(),
  name: z.string({ error: 'Name must be a string' }).nullable(),
  regularPrice: z.coerce
    .number({ error: 'RegularPrice must be a number' })
    .nullable(),
});

export type Cabin = z.infer<typeof CabinSchema>;
export type NullableCabin = z.infer<typeof NullableCabinSchema>;
