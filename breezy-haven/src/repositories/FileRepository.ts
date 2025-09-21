import { supabase } from '@/lib';
import type { Result } from '@/shared/types';

export interface IFileRepository {
  uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): Promise<Result<{ id: string; path: string; fullPath: string }, undefined>>;

  deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): Promise<Result<undefined, undefined>>;
}

export class FileRepository implements IFileRepository {
  async uploadFile(
    file: File,
    path: string,
    bucketId: string
  ): Promise<
    Result<{ id: string; path: string; fullPath: string }, undefined>
  > {
    const { data, error } = await supabase.storage
      .from(bucketId)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
      });

    if (error)
      return {
        type: 'error',
        payload: undefined,
      };

    return {
      type: 'success',
      payload: data,
    };
  }

  async deleteFiles(
    paths: readonly string[],
    bucketId: string
  ): Promise<Result<undefined, undefined>> {
    const { error } = await supabase.storage.from(bucketId).remove([...paths]);
    if (error)
      return {
        type: 'error',
        payload: undefined,
      };

    return {
      type: 'success',
      payload: undefined,
    };
  }
}
