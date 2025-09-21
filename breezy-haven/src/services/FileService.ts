import type { IFileRepository } from '@/repositories';
import type { Result } from '@/shared/types';

interface IFileService {
  uploadFileAsync(
    file: File,
    path: string,
    bucketId: string
  ): Promise<Result<{ id: string; path: string; fullPath: string }, undefined>>;

  deleteFilesAsync(
    paths: readonly string[],
    bucketId: string
  ): Promise<Result<undefined, undefined>>;
}

export class FileService implements IFileService {
  constructor(
    private readonly _verifyAuthorizationAsync: () => Promise<void>,
    private readonly _fileRepo: IFileRepository
  ) {}

  async uploadFileAsync(
    file: File,
    path: string,
    bucketId: string
  ): Promise<
    Result<{ id: string; path: string; fullPath: string }, undefined>
  > {
    await this._verifyAuthorizationAsync();

    return this._fileRepo.uploadFile(file, path, bucketId);
  }

  async deleteFilesAsync(
    paths: readonly string[],
    bucketId: string
  ): Promise<Result<undefined, undefined>> {
    await this._verifyAuthorizationAsync();

    return this._fileRepo.deleteFiles(paths, bucketId);
  }
}
