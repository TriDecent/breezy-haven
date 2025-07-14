import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import IRepository from './IRepository';
import { RawSetting } from './types';

export default class SettingRepository implements IRepository<RawSetting> {
  async getAll(): Promise<readonly RawSetting[] | PostgrestError> {
    const { data, error } = await supabase.from('settings').select();

    if (error) {
      console.log('Error fetching settings:', error);
      return error;
    }

    return data ?? [];
  }

  async getById(id: number): Promise<RawSetting | PostgrestError> {
    const { data, error } = await supabase
      .from('settings')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.log('Error fetching setting:', error);
      return error;
    }

    return data;
  }

  async get<K extends keyof RawSetting>(
    key: K,
    id: number
  ): Promise<RawSetting[K] | PostgrestError> {
    const { data, error } = await supabase
      .from('settings')
      .select(key)
      .eq('id', id)
      .single();

    if (error) {
      console.log('Error fetching setting property:', error);
      return error;
    }

    return (data as unknown as Record<K, RawSetting[K]>)[key];
  }

  async create(
    item: Partial<RawSetting>
  ): Promise<RawSetting | PostgrestError> {
    const { data, error } = await supabase
      .from('settings')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.log('Error creating setting:', error);
      return error;
    }

    return data;
  }

  async update(
    id: number,
    updatedFields: Partial<RawSetting>
  ): Promise<RawSetting | PostgrestError> {
    const { data, error } = await supabase
      .from('settings')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.log('Error updating setting:', error);
      return error;
    }

    return data;
  }

  async delete(id: number): Promise<PostgrestError | null> {
    const { error } = await supabase.from('settings').delete().eq('id', id);

    if (error) {
      console.log('Error deleting setting:', error);
      return error;
    }

    return null;
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
