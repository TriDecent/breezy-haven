import type { Result } from '@/shared/types';

export type ActionResponse<TInput, TError> =
  | Result<
      { userEntered: null; errors: null; isSuccess: true },
      {
        userEntered: TInput;
        errors: TError;
        isSuccess: false;
      }
    >
  | Readonly<{
      type: 'initial';
      payload: Readonly<{
        userEntered: null;
        errors: null;
      }>;
    }>;
