import { supabase } from '@/lib/supabase';
import { DTOCabin } from '@/repositories';

import type { Cabin, NullableCabin } from '@/shared/schemas';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';
import { IService } from './BaseService';

export default class CabinService<T extends Cabin | NullableCabin>
  implements IService<DTOCabin, T>
{
  constructor(private readonly _service: IService<DTOCabin, T>) {
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

  async getCount(): Promise<{
    count: number | null;
    error: PostgrestError | null;
  }> {
    await this._service.verifyPermission();

    const { count, error } = await supabase
      .from('cabins')
      .select('*', { count: 'exact', head: true });

    return { count: count, error };
  }
}
