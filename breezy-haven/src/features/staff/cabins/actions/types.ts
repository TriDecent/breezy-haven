import { CabinSchema, type DeepReadonly } from '@/shared';
import z from 'zod';

export const AddCabinSchema = CabinSchema.omit({
  id: true,
  created_at: true,
})
  .extend({
    image: z
      .file({ error: 'Image must be File' })
      .refine(
        file => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
        { error: 'Image file must be png, jpg or webp' }
      ),
  })
  .strip();
export type SafeAddCabinInput = z.infer<typeof AddCabinSchema>;

export type ActionResponse = DeepReadonly<
  | {
      userEntered: Partial<Omit<SafeAddCabinInput, 'image'>>;
      error: Partial<
        Record<keyof SafeAddCabinInput, string[]> & {
          unexpected: string;
        }
      >;
      success?: boolean;
    }
  | { userEntered: null; error: null; success?: boolean }
>;
