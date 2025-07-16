import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import { RawRow, TableName } from './types';

export default class Repository<T extends RawRow> {
  protected readonly _tableName: TableName;

  constructor(tableName: TableName) {
    this._tableName = tableName;
  }

  async getAll(): Promise<T[] | PostgrestError> {
    const { data, error } = await supabase.from(this._tableName).select();

    if (error) {
      console.log(`Error fetching ${this._tableName}:`, error);
      return error;
    }

    return (data as T[]) ?? [];
  }

  async getById(id: number): Promise<T | PostgrestError> {
    const { data, error } = await supabase
      .from(this._tableName)
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.log(`Error fetching ${this._tableName}:`, error);
      return error;
    }

    return data as T;
  }

  async get<K extends keyof T>(
    key: K,
    id: number
  ): Promise<T[K] | PostgrestError> {
    const { data, error } = await supabase
      .from(this._tableName)
      .select(key as string)
      .eq('id', id)
      .single();

    if (error) {
      console.log(`Error fetching ${this._tableName} property:`, error);
      return error;
    }

    return (data as unknown as Record<K, T[K]>)[key];
  }

  async create(item: Partial<T>): Promise<T | PostgrestError> {
    const { data, error } = await supabase
      .from(this._tableName)
      .insert(item)
      .select()
      .single();

    if (error) {
      console.log(`Error creating ${this._tableName}:`, error);
      return error;
    }

    return data as T;
  }

  async update(
    id: number,
    updatedFields: Partial<T>
  ): Promise<T | PostgrestError> {
    const { data, error } = await supabase
      .from(this._tableName)
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log(`Error updating ${this._tableName}:`, error);
      return error;
    }

    return data as T;
  }

  async delete(id: number): Promise<PostgrestError | null> {
    const { error } = await supabase
      .from(this._tableName)
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`Error deleting ${this._tableName}:`, error);
      return error;
    }

    return null;
  }
}
