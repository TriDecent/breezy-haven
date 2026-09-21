import type { PostgrestError } from '@supabase/supabase-js';

export type DatabaseError = {
  type: 'database';
  db: PostgrestError;
};

export type UnexpectedError = {
  type: 'unexpected';
  message: string;
};

export type ValidationErrors<T> = Partial<Record<keyof T, string[]>>;

export type ValidationError<T> = {
  type: 'validation';
  fields: ValidationErrors<T>;
};

export type WarningInfo = {
  corruptedCount: number;
  total: number;
};

export type GetAllServiceReturnType<DataType> = Promise<
  | { data: DataType[]; errors: null; warnings?: WarningInfo }
  | { data: null; errors: DatabaseError | UnexpectedError }
>;

export type ServiceReturnType<DataType, ErrorType = DataType> = Promise<
  | { data: DataType; errors: null }
  | {
      data: null;
      errors: DatabaseError | ValidationError<ErrorType> | UnexpectedError;
    }
>;
