import type { IRepository } from '@/repositories';
import type { DTORow } from '@/repositories/types';

import type { Schemas } from '@/shared/schemas';
import type { PostgrestError } from '@supabase/supabase-js';
import type { IService } from './BaseService';
import type { GetAllServiceReturnType, ServiceReturnType } from './types';

export interface IStaffService<DTOType, SchemaType>
  extends IService<DTOType, SchemaType> {
  uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): ServiceReturnType<{ id: string; path: string; fullPath: string }, Error>;
  deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): ServiceReturnType<null, Error>;
}

export class BaseStaffService<
  DTOType extends DTORow,
  SchemaType extends Schemas,
> implements IStaffService<DTOType, SchemaType>
{
  constructor(
    private readonly _service: IService<DTOType, SchemaType>,
    private readonly _repository: IRepository<DTOType>
  ) {}

  async getAll(): GetAllServiceReturnType<SchemaType> {
    return this._service.getAll();
  }

  async getById(id: number): ServiceReturnType<SchemaType> {
    return this._service.getById(id);
  }

  async create(item: Partial<DTOType>): ServiceReturnType<SchemaType> {
    return this._service.create(item);
  }

  async update(
    id: number,
    updatedFields: Partial<DTOType>
  ): ServiceReturnType<SchemaType> {
    return this._service.update(id, updatedFields);
  }

  async delete(id: number): ServiceReturnType<SchemaType> {
    return this._service.delete(id);
  }

  async verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }

  async handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): ServiceReturnType<SchemaType> {
    return this._service.handleRepositoryResult(action);
  }

  async handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): GetAllServiceReturnType<SchemaType> {
    return this._service.handleRepositoryResultArray(action);
  }

  async uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): ServiceReturnType<{ id: string; path: string; fullPath: string }, Error> {
    await this._service.verifyPermission();
    const { data, error } = await this._repository.uploadFile(
      file,
      path,
      bucketId
    );

    if (error)
      return {
        data: null,
        errors: {
          type: 'unexpected',
          message: 'An error has occurred while trying to upload the file',
        },
      };

    return { data, errors: error };
  }

  async deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): ServiceReturnType<null, Error> {
    await this._service.verifyPermission();
    const error = await this._repository.deleteFiles(paths, bucketId);
    if (error) {
      return {
        data: null,
        errors: {
          type: 'unexpected',
          message: 'An error has occurred while trying to delete the files',
        },
      };
    }

    return {
      data: null,
      errors: null,
    };
  }
}
