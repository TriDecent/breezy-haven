'use server';
import { staffCabinService } from '@/services';
import { CabinSchema, type DeepReadonly } from '@/shared';
import z from 'zod';

const AddCabinSchema = CabinSchema.omit({ id: true, created_at: true });
type SafeAddCabinInput = z.infer<typeof AddCabinSchema>;

type ActionResponse = DeepReadonly<
  | {
      userEntered: Partial<SafeAddCabinInput>;
      error: Partial<
        Record<keyof SafeAddCabinInput, string[]> & {
          unexpected: string;
        }
      >;
    }
  | { userEntered: null; error: null }
>;

export async function addCabinAction(
  _currentState: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  // TODO: verify staff authentication
  const input = Object.fromEntries(formData.entries());

  const parsedInput = AddCabinSchema.safeParse(input);

  if (!parsedInput.success) {
    const errors = z.flattenError(parsedInput.error).fieldErrors;

    return {
      userEntered: input,
      error: errors,
    };
  }

  const { errors } = await staffCabinService.create(parsedInput.data);

  if (errors)
    return {
      userEntered: input,
      error: {
        unexpected:
          'An error occurred while trying to add a new a cabin. Please try again!',
      },
    };

  return {
    userEntered: null,
    error: null,
  };
}
