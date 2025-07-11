import { PostgrestError } from '@supabase/supabase-js';

export default interface IRepository<T> {
  getAll(): Promise<readonly T[] | PostgrestError>;
  getById(id: number): Promise<T | PostgrestError>;
  create(item: Partial<T>): Promise<T | PostgrestError>;
  update(id: number, updatedFields: Partial<T>): Promise<T | PostgrestError>;
  delete(id: number): Promise<PostgrestError | null>;
  get<K extends keyof T>(key: K, id: number): Promise<T[K] | PostgrestError>;
}
