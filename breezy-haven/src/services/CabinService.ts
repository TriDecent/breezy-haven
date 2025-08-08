import { supabase } from '@/lib/supabase';
import { DTOCabin } from '@/repositories';
import { PostgrestError } from '@supabase/supabase-js';
import { IService, ServiceReturnType } from './BaseService';

export default class CabinService implements IService<DTOCabin> {
  constructor(private readonly _service: IService<DTOCabin>) {}
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
    const { count, error } = await supabase
      .from('cabins')
      .select('*', { count: 'exact', head: true });

    return { count: count, error };
  }
}
