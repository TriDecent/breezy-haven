import { supabase } from '@/lib/supabase';
import { DTOSetting } from '@/repositories';
import { PostgrestError } from '@supabase/supabase-js';
import { IService, ServiceReturnType } from './BaseService';

export default class SettingService implements IService<DTOSetting> {
  constructor(private readonly _service: IService<DTOSetting>) {}
  getAll(): ServiceReturnType<DTOSetting[], PostgrestError | null> {
    return this._service.getAll();
  }
  getById(
    id: number
  ): ServiceReturnType<DTOSetting | null, PostgrestError | null> {
    return this._service.getById(id);
  }
  create(
    item: Partial<DTOSetting>
  ): ServiceReturnType<DTOSetting | null, PostgrestError | null> {
    return this._service.create(item);
  }
  update(
    id: number,
    updatedFields: Partial<DTOSetting>
  ): ServiceReturnType<DTOSetting | null, PostgrestError | null> {
    return this._service.update(id, updatedFields);
  }
  delete(
    id: number
  ): ServiceReturnType<DTOSetting | null, PostgrestError | null> {
    return this._service.delete(id);
  }

  async getDefaultSettings(): Promise<{
    data: DTOSetting | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabase.from('settings').select().single();

    return { data: data, error };
  }
}
