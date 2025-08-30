import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { DTORow, DTOToTableName } from './types';

export type RepositoryReturnType<TData, TError> = Promise<
  Readonly<{ data: TData; error: null } | { data: null; error: TError }>
>;

export interface IRepository<T> {
  getAll(): RepositoryReturnType<T[], PostgrestError>;
  getById(id: number): RepositoryReturnType<T, PostgrestError>;
  create(item: Partial<T>): RepositoryReturnType<T, PostgrestError>;
  update(
    id: number,
    updatedFields: Partial<T>
  ): RepositoryReturnType<T, PostgrestError>;
  delete(id: number): RepositoryReturnType<T, PostgrestError>;
}

export class Repository<T extends DTORow> implements IRepository<T> {
  protected readonly _tableName: DTOToTableName<T>;

  constructor(tableName: DTOToTableName<T>) {
    this._tableName = tableName;
  }

  private get table() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return supabase.from(this._tableName) as unknown as any;
  }

  async getAll(): RepositoryReturnType<T[], PostgrestError> {
    const { data, error } = await this.table.select();

    return {
      data: data,
      error,
    };
  }

  async getById(id: number): RepositoryReturnType<T, PostgrestError> {
    const { data, error } = await this.table.select().eq('id', id).single();

    return {
      data: data,
      error,
    };
  }

  async create(item: Partial<T>): RepositoryReturnType<T, PostgrestError> {
    const { data, error } = await this.table.insert(item).select().single();

    return {
      data: data,
      error,
    };
  }

  async update(
    id: number,
    updatedFields: Partial<T>
  ): RepositoryReturnType<T, PostgrestError> {
    const { data, error } = await this.table
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    return {
      data,
      error,
    };
  }

  async delete(id: number): RepositoryReturnType<T, PostgrestError> {
    const { data, error } = await this.table
      .delete()
      .eq('id', id)
      .select()
      .single();

    return {
      data,
      error,
    };
  }
}
