import { supabase } from '@/lib/supabase';
import { DTOCabin } from '@/repositories';
import { PostgrestError } from '@supabase/supabase-js';
import { cache } from 'react';
import { IService, ServiceReturnType } from './BaseService';

export default class CabinService implements IService<DTOCabin> {
  constructor(private readonly _service: IService<DTOCabin>) {
    this.getAll = cache(this.getAll.bind(this));
    this.getById = cache(this.getById.bind(this));
  }

  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }

  getAll(): ServiceReturnType<DTOCabin[], PostgrestError | null> {
    return this._service.getAll();
  }
  getById(
    id: number
  ): ServiceReturnType<DTOCabin | null, PostgrestError | null> {
    return this._service.getById(id);
  }
  create(
    item: Partial<DTOCabin>
  ): ServiceReturnType<DTOCabin | null, PostgrestError | null> {
    return this._service.create(item);
  }
  update(
    id: number,
    updatedFields: Partial<DTOCabin>
  ): ServiceReturnType<DTOCabin | null, PostgrestError | null> {
    return this._service.update(id, updatedFields);
  }
  delete(
    id: number
  ): ServiceReturnType<DTOCabin | null, PostgrestError | null> {
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
