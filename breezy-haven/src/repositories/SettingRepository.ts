import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import Repository from './Repository';
import { RawSetting } from './types';

export default class SettingRepository extends Repository<RawSetting> {
  constructor() {
    super('settings');
  }

  async getDefaultSettings(): Promise<RawSetting | PostgrestError> {
    const { data, error } = await supabase.from('settings').select().single();
    if (error) {
      console.log('Error fetching default settings:', error);
      return error;
    }
    return data;
  }
}
