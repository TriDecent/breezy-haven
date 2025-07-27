import { supabase } from '@/lib/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { Setting } from '.';
import Repository from './Repository';
import { RawSetting } from './types';

export default class SettingRepository extends Repository<RawSetting> {
  constructor() {
    super('settings');
  }

  async getDefaultSettings(): Promise<{
    data: Setting | null;
    error: PostgrestError | null;
  }> {
    const { data, error } = await supabase.from('settings').select().single();

    return { data: data as Setting | null, error }; // It can have nullable properties, but just pray it doesn't (:
  }
}
