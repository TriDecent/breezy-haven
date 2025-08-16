import { supabase } from '@/lib/supabase';
import { DTOSetting } from '@/repositories';
import type { NullableSetting, Setting } from '@/shared';
import { PostgrestError } from '@supabase/supabase-js';
import { IService } from './BaseService';

export default class SettingService<T extends Setting | NullableSetting>
  implements IService<DTOSetting, T>
{
  constructor(private readonly _service: IService<DTOSetting, T>) {}
  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }
  getAll() {
    return this._service.getAll();
  }
  getById(id: number) {
    return this._service.getById(id);
  }
  create(item: Partial<DTOSetting>) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: Partial<DTOSetting>) {
    return this._service.update(id, updatedFields);
  }
  delete(id: number) {
    return this._service.delete(id);
  }
  handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResult(action);
  }
  handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResultArray(action);
  }

  async getDefaultSettings() {
    await this._service.verifyPermission();

    return this.handleRepositoryResult(async () =>
      supabase.from('settings').select().single()
    );
  }
}
