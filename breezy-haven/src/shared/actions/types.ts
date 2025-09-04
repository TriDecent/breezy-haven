export type ActionResponse<T1, T2> = Readonly<
  | {
      userEntered: T1;
      errors: T2;
    }
  | { userEntered: null; errors: null; isSuccess?: true }
>;
