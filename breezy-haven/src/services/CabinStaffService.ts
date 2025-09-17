import { DTOCabin } from '@/repositories';

import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';

import type { Cabin, NullableCabin } from '@/shared/schemas';
import type { IStaffService } from './BaseStaffService';
import type { ServiceReturnType } from './types';

export default class CabinStaffService<T extends Cabin | NullableCabin>
  implements IStaffService<DTOCabin, T>
{
  constructor(private readonly _service: IStaffService<DTOCabin, T>) {
    this.getAll = cache(this.getAll.bind(this));
    this.getById = cache(this.getById.bind(this));
  }
  handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResultArray(action);
  }
  handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResult(action);
  }
  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }
  getAll() {
    return this._service.getAll();
  }
  getById(id: number) {
    return this._service.getById(id);
  }
  create(item: Partial<DTOCabin>) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: Partial<DTOCabin>) {
    return this._service.update(id, updatedFields);
  }
  delete(id: number) {
    return this._service.delete(id);
  }
  async uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): ServiceReturnType<{ id: string; path: string; fullPath: string }, Error> {
    return this._service.uploadFile(file, path, bucketId);
  }

  async deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): ServiceReturnType<null, Error> {
    return this._service.deleteFiles(paths, bucketId);
  }
}
