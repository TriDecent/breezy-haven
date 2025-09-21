export type Result<TSuccess, TError> = Readonly<
  | {
      type: 'success';
      payload: TSuccess;
    }
  | { type: 'error'; payload: TError }
>;
