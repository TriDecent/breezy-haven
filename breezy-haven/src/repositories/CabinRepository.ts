import { supabase } from '@/lib';
import { PostgrestError } from '@supabase/supabase-js';
import Repository from './Repository';
import { RawCabin } from './types';

export default class CabinRepository extends Repository<RawCabin> {
  constructor() {
    super('cabins');
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

  // Add any Cabin-specific methods here if needed
}
