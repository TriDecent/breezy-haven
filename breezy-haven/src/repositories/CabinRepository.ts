import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import IRepository from './IRepository';
import { RawCabin } from './types';

export default class CabinRepository implements IRepository<RawCabin> {
  async getAll(): Promise<readonly RawCabin[] | PostgrestError> {
    const { data, error } = await supabase.from('cabins').select();

    if (error) {
      console.error('Error fetching cabins:', error);
      return error;
    }

    return data ?? [];
  }

  async getById(id: number): Promise<RawCabin | PostgrestError> {
    const { data, error } = await supabase
      .from('cabins')
      .select()
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cabin:', error);
      return error;
    }

    return data;
  }

  async get<K extends keyof RawCabin>(
    key: K,
    id: number
  ): Promise<RawCabin[K] | PostgrestError> {
    const { data, error } = await supabase
      .from('cabins')
      .select(key as string)
      .eq('id', id)
      .single();

    if (error) {
      console.error('Error fetching cabin property:', error);
      return error;
    }

    return (data as unknown as Record<K, RawCabin[K]>)[key];
  }

  async create(item: Partial<RawCabin>): Promise<RawCabin | PostgrestError> {
    const { data, error } = await supabase
      .from('cabins')
      .insert(item)
      .select()
      .single();

    if (error) {
      console.error('Error creating cabin:', error);
      return error;
    }

    return data;
  }

  async update(
    id: number,
    updatedFields: Partial<RawCabin>
  ): Promise<RawCabin | PostgrestError> {
    const { data, error } = await supabase
      .from('cabins')
      .update(updatedFields)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('Error updating cabin:', error);
      return error;
    }

    return data;
  }

  async delete(id: number): Promise<PostgrestError | null> {
    const { error } = await supabase.from('cabins').delete().eq('id', id);

    if (error) {
      console.error('Error deleting cabin:', error);
      return error;
    }

    return null;
  }
}
