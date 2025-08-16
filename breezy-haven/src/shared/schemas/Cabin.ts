import { z } from 'zod';

export const CabinSchema = z.object({
  created_at: z.string({ error: 'created_at must be a string' }),
  description: z.string({ error: 'description must be a string' }),
  discount: z.coerce.number({ error: 'discount must be a number' }),
  id: z.coerce.number({ error: 'id must be a number' }),
  image: z.string({ error: 'image must be a string' }),
  maxCapacity: z.coerce.number({ error: 'maxCapacity must be a number' }),
  name: z.string({ error: 'name must be a string' }),
  regularPrice: z.coerce.number({ error: 'regularPrice must be a number' }),
});
export const NullableCabinSchema = z.object({
  created_at: z.string({ error: 'created_at must be a string' }),
  description: z.string({ error: 'description must be a string' }).nullable(),
  discount: z.coerce.number({ error: 'discount must be a number' }).nullable(),
  id: z.coerce.number({ error: 'id must be a number' }),
  image: z.string({ error: 'image must be a string' }).nullable(),
  maxCapacity: z.coerce.number({ error: 'maxCapacity must be a number' }).nullable(),
  name: z.string({ error: 'name must be a string' }).nullable(),
  regularPrice: z.coerce.number({ error: 'regularPrice must be a number' }).nullable(),
});

export type Cabin = z.infer<typeof CabinSchema>;
export type NullableCabin = z.infer<typeof NullableCabinSchema>;
