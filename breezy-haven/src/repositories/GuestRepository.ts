import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import IRepository from './IRepository';
import { RawGuest } from './types';

export default class GuestRepository implements IRepository<RawGuest> {
  async getAll(): Promise<readonly RawGuest[] | PostgrestError> {
    const { data, error } = await supabase.from('guests').select();

    if (error) {
      console.error('Error fetching guests:', error);
      return error;
    }

    return data ?? [];
  }

  async getById(id: number): Promise<RawGuest | PostgrestError> {
    const { data, error } = await supabase
      .from('guests')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching guest:', error);
      return error;
    }

    return data;
  }

  async get<K extends keyof RawGuest>(
    key: K,
    id: number
  ): Promise<RawGuest[K] | PostgrestError> {
    const { data, error } = await supabase
      .from('guests')
      .select(key as string)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching guest property:', error);
      return error;
    }

    return (data as unknown as Record<K, RawGuest[K]>)[key];
  }

  async create(item: Partial<RawGuest>): Promise<RawGuest | PostgrestError> {
    const { data, error } = await supabase
      .from('guests')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating guest:', error);
      return error;
    }

    return data;
  }

  async update(
    id: number,
    updatedFields: Partial<RawGuest>
  ): Promise<RawGuest | PostgrestError> {
    const { data, error } = await supabase
      .from('guests')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating guest:', error);
      return error;
    }

    return data;
  }

  async delete(id: number): Promise<PostgrestError | null> {
    const { error } = await supabase.from('guests').delete().eq('id', id);

    if (error) {
      console.error('Error deleting guest:', error);
      return error;
    }

    return null;
  }
}
