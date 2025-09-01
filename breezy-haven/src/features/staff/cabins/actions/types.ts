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

export const UpdateCabinSchema = CabinSchema.omit({
  created_at: true,
})
  .extend({
    image: z
      .file({ error: 'Image must be File' })
      .refine(
        file => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
        { error: 'Image file must be png, jpg or webp' }
      )
      .optional(),
    originalImage: z.url({ error: 'Original image must be url' }),
  })
  .strip();

export type SafeUpdateCabinInput = z.infer<typeof UpdateCabinSchema>;

export type ActionResponse<T extends SafeAddCabinInput | SafeUpdateCabinInput> =
  DeepReadonly<
    | {
        userEntered: Partial<Omit<T, 'image'>>;
        error: Partial<
          Record<keyof T, string[]> & {
            unexpected: string;
          }
        >;
        success?: boolean;
      }
    | { userEntered: null; error: null; success?: boolean }
  >;

export type AddActionResponse = ActionResponse<SafeAddCabinInput>;
export type UpdateActionResponse = ActionResponse<SafeUpdateCabinInput>;
