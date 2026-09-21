import type { ActionResponse } from '@/shared/actions';
import { CabinSchema, type Cabin } from '@/shared/schemas';
import z from 'zod';

export type Result<S, F> =
  | readonly [success: S, failed: null]
  | readonly [success: null, failed: F];

export const ImageValidator = z
  .file({ error: 'Image must be File' })
  .refine(
    file => ['image/png', 'image/jpeg', 'image/webp'].includes(file.type),
    { error: 'Image file must be png, jpg or webp' }
  );

export const AddCabinSchema = CabinSchema.omit({
  id: true,
  created_at: true,
}).extend({
  image: ImageValidator,
});

export type SafeAddCabinInput = z.infer<typeof AddCabinSchema>;

export const UpdateCabinSchema = CabinSchema.omit({
  created_at: true,
}).extend({
  image: z.file({ error: 'Image must be File' }),
});

export type SafeUpdateCabinInput = z.infer<typeof UpdateCabinSchema>;

export type SuccessResponse = Readonly<{
  userEntered: null;
  errors: null;
  success?: true;
  updatedCabin?: Cabin;
}>;

export type FailedResponse<T> = Readonly<{
  userEntered: Readonly<Partial<Omit<T, 'image'>>>;
  errors: Readonly<
    Partial<
      Record<keyof T, string[]> & {
        unexpected: string;
      }
    >
  >;
  success?: false;
}>;

export type CabinOperationResponse<T> =
  ActionResponse<
    Readonly<Partial<Omit<T, 'image'>>>,
    Readonly<
      Partial<
        Record<keyof T, string[]> & {
          unexpected: string;
        }
      >
    >
  > extends infer U
    ? U extends { type: 'success'; payload: object }
      ? U & { payload: U['payload'] & { updatedCabin?: Cabin } }
      : U
    : never;

export type AddActionResponse = CabinOperationResponse<SafeAddCabinInput>;
export type UpdateActionResponse = CabinOperationResponse<SafeUpdateCabinInput>;
