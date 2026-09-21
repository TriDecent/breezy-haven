export type Result<TSuccess, TError> = Readonly<
  | {
      type: 'success';
      payload: TSuccess;
    }
  | { type: 'error'; payload: TError }
>;

export type NonNullableObject<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};
