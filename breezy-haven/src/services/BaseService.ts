import { IRepository } from '@/repositories';
import { DTORow } from '@/repositories/types';
import { PostgrestError } from '@supabase/supabase-js';

export type ServiceReturnType<DataType, ErrorType> = Promise<
  Readonly<{
    data: DataType;
    error: ErrorType;
  }>
>;

export interface IService<T extends DTORow> {
  getAll(): ServiceReturnType<T[], PostgrestError | null>;
  getById(id: number): ServiceReturnType<T | null, PostgrestError | null>;
  create(item: Partial<T>): ServiceReturnType<T | null, PostgrestError | null>;
  update(
    id: number,
    updatedFields: Partial<T>
  ): ServiceReturnType<T | null, PostgrestError | null>;
  delete(id: number): ServiceReturnType<T | null, PostgrestError | null>;

  verifyPermission(): Promise<void>;
}

export class BaseService<T extends DTORow> implements IService<T> {
  constructor(
    private readonly _repository: IRepository<T>,
    private readonly _verifyPermissionAsync: () => Promise<void>
  ) {}

  verifyPermission(): Promise<void> {
    return this._verifyPermissionAsync();
  }

  async getAll(): ServiceReturnType<T[], PostgrestError | null> {
    await this._verifyPermissionAsync();

    const { data, error } = await this._repository.getAll();
    return {
      data: data ?? [],
      error,
    };
  }

  async getById(
    id: number
  ): ServiceReturnType<T | null, PostgrestError | null> {
    await this._verifyPermissionAsync();

    const { data, error } = await this._repository.getById(id);
    return { data, error };
  }

  async delete(id: number): ServiceReturnType<T | null, PostgrestError | null> {
    await this._verifyPermissionAsync();

    const { data, error } = await this._repository.delete(id);
    return { data, error };
  }
  async update(
    id: number,
    updatedFields: Partial<T>
  ): ServiceReturnType<T | null, PostgrestError | null> {
    await this._verifyPermissionAsync();

    const { data, error } = await this._repository.update(id, updatedFields);
    return { data, error };
  }
  async create(
    item: Partial<T>
  ): ServiceReturnType<T | null, PostgrestError | null> {
    await this._verifyPermissionAsync();

    const { data, error } = await this._repository.create(item);
    return { data, error };
  }
}
