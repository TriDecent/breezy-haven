import type { Result } from '@/shared/types';

export type ActionResponse<T1, T2> = Readonly<
  | Result<
      { userEntered: null; errors: null; isSuccess: true },
      {
        userEntered: T1;
        errors: T2;
        isSuccess: false;
      }
    >
  | {
      type: 'initial';
      payload: Readonly<{
        userEntered: null;
        errors: null;
      }>;
    }
>;
