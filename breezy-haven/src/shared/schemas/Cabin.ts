import { z } from 'zod';

export const CabinSchema = z.object({
  created_at: z.string(),
  description: z.string(),
  discount: z.number(),
  id: z.number(),
  image: z.string(),
  maxCapacity: z.number(),
  name: z.string(),
  regularPrice: z.number(),
});

export type Cabin = z.infer<typeof CabinSchema>;
