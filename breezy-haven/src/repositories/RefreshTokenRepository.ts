import { supabase } from '@/lib';

export interface IRefreshTokenRepository {
  addAsync(tokenId: string): Promise<void>;
  getIsExistAsync(tokenId: string): Promise<boolean>;
  revokeAsync(tokenId: string): Promise<void>;
}

class RefreshTokenRepository implements IRefreshTokenRepository {
  async addAsync(tokenId: string): Promise<void> {
    const { data } = await supabase
      .from('refresh_token')
      .insert({ tokenId })
      .select()
      .single();

    if (!data)
      throw new Error('An error has occurred while trying to add the token');
  }

  async getIsExistAsync(tokenId: string): Promise<boolean> {
    const { data } = await supabase
      .from('refresh_token')
      .select()
      .eq('tokenId', tokenId)
      .single();

    return !!data;
  }

  async revokeAsync(tokenId: string): Promise<void> {
    const { data } = await supabase
      .from('refresh_token')
      .delete()
      .eq('tokenId', tokenId)
      .single();

    if (!data)
      throw new Error('An error has occurred while trying to revoke the token');
  }
}

export const refreshTokenRepository = new RefreshTokenRepository();
