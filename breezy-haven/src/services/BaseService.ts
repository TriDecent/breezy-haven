import { IRepository } from '@/repositories';
import type { DTORow } from '@/repositories/types';
import type { Schemas } from '@/shared';
import { PostgrestError } from '@supabase/supabase-js';
import { z } from 'zod';
import type {
  GetAllServiceReturnType,
  ServiceReturnType,
  ValidationError,
} from './types';

export interface IService<DTOType, SchemaType> {
  getAll(): GetAllServiceReturnType<SchemaType>;
  getById(id: number): ServiceReturnType<SchemaType>;
  create(item: Partial<DTOType>): ServiceReturnType<SchemaType>;
  update(
    id: number,
    updatedFields: Partial<DTOType>
  ): ServiceReturnType<SchemaType>;
  delete(id: number): ServiceReturnType<SchemaType>;
  verifyPermission(): Promise<void>;
  handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): ServiceReturnType<SchemaType>;
  handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): GetAllServiceReturnType<SchemaType>;
}

export class BaseService<DTOType extends DTORow, SchemaType extends Schemas>
  implements IService<DTOType, SchemaType>
{
  constructor(
    private readonly _repository: IRepository<DTOType>,
    private readonly _verifyPermissionAsync: () => Promise<void>,
    private readonly _schema: z.ZodType<SchemaType>
  ) {}

  verifyPermission(): Promise<void> {
    return this._verifyPermissionAsync();
  }

  async getAll(): GetAllServiceReturnType<SchemaType> {
    this.verifyPermission();

    const { data, error: postgrestError } = await this._repository.getAll();

    if (postgrestError) {
      return { data: null, errors: { type: 'database', db: postgrestError } };
    }

    if (!data || !Array.isArray(data)) {
      return {
        data: null,
        errors: { type: 'unexpected', message: 'Invalid data format' },
      };
    }

    const validItems: SchemaType[] = [];
    let corruptedCount = 0;

    for (const item of data) {
      const result = this._schema.safeParse(item);
      if (result.success) validItems.push(result.data);
      else {
        corruptedCount++;
        console.warn('Corrupted item:', item, result.error);
      }
    }

    if (data.length !== 0 && validItems.length === 0) {
      return {
        data: null,
        errors: { type: 'unexpected', message: 'All data corrupted' },
      };
    }

    if (corruptedCount > 0) {
      return {
        data: validItems,
        errors: null,
        warnings: { corruptedCount, total: data.length },
      };
    }

    return { data: validItems, errors: null };
  }

  async getById(id: number): ServiceReturnType<SchemaType> {
    this.verifyPermission();
    return this.handleRepositoryResult(() => this._repository.getById(id));
  }

  async create(item: Partial<DTOType>): ServiceReturnType<SchemaType> {
    this.verifyPermission();
    return this.handleRepositoryResult(() => this._repository.create(item));
  }

  async update(
    id: number,
    updatedFields: Partial<DTOType>
  ): ServiceReturnType<SchemaType> {
    this.verifyPermission();
    return this.handleRepositoryResult(() =>
      this._repository.update(id, updatedFields)
    );
  }

  async delete(id: number): ServiceReturnType<SchemaType> {
    this.verifyPermission();
    return this.handleRepositoryResult(() => this._repository.delete(id));
  }

  public async handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): ServiceReturnType<SchemaType> {
    const { data, error: postgrestError } = await action();

    if (postgrestError)
      return { data: null, errors: { type: 'database', db: postgrestError } };

    const parsed = this._schema.safeParse(data);
    if (!parsed.success) return this.validationError(parsed.error);

    return { data: parsed.data, errors: null };
  }

  private validationError(zError: z.ZodError): {
    data: null;
    errors: ValidationError<SchemaType>;
  } {
    const fields = z.flattenError(zError).fieldErrors;
    return { data: null, errors: { type: 'validation', fields } };
  }

  public async handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ): GetAllServiceReturnType<SchemaType> {
    const { data, error: postgrestError } = await action();

    if (postgrestError)
      return { data: null, errors: { type: 'database', db: postgrestError } };

    if (!Array.isArray(data))
      return {
        data: null,
        errors: { type: 'unexpected', message: 'Data is not array' },
      };

    const validItems: SchemaType[] = [];
    let corruptedCount = 0;

    for (const item of data) {
      const result = this._schema.safeParse(item);
      if (result.success) validItems.push(result.data);
      else corruptedCount++;
    }

    if (validItems.length === 0 && data.length > 0)
      return {
        data: null,
        errors: { type: 'unexpected', message: 'All data corrupted' },
      };

    return {
      data: validItems,
      errors: null,
      warnings:
        corruptedCount > 0
          ? { corruptedCount: corruptedCount, total: data.length }
          : undefined,
    };
  }
}
