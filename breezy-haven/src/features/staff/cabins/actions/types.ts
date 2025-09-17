import { CabinSchema, type Cabin } from '@/shared/schemas';
import z from 'zod';

export type Result<S, F> =
  | readonly [success: S, failed: null]
  | readonly [success: null, failed: F];

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
  })
  .strip();

export type SafeUpdateCabinInput = z.infer<typeof UpdateCabinSchema>;

export type SuccessResponse = Readonly<{
  userEntered: null;
  error: null;
  success?: true;
  updatedCabin?: Cabin;
}>;

export type FailedResponse<T> = Readonly<{
  userEntered: Readonly<Partial<Omit<T, 'image'>>>;
  error: Readonly<
    Partial<
      Record<keyof T, string[]> & {
        unexpected: string;
      }
    >
  >;
  success?: false;
}>;

export type ActionResponse<T> = Readonly<SuccessResponse | FailedResponse<T>>;

export type AddActionResponse = ActionResponse<SafeAddCabinInput>;
export type UpdateActionResponse = ActionResponse<SafeUpdateCabinInput>;
