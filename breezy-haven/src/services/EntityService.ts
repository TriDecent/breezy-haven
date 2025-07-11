import type IRepository from '@/repositories/IRepository';
import { PostgrestError } from '@supabase/supabase-js';

export interface IEntityService<RawType, ProcessedType extends RawType> {
  getAll(): Promise<{ data: ProcessedType[]; error: PostgrestError | null }>;

  getById(
    id: number
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }>;

  create(
    item: Partial<RawType>
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }>;

  update(
    id: number,
    updatedFields: Partial<RawType>
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }>;

  delete(id: number): Promise<{ error: PostgrestError | null }>;

  get<K extends keyof RawType>(
    key: K,
    id: number
  ): Promise<{ data: ProcessedType[K] | null; error: PostgrestError | null }>;
}

export class EntityService<RawType, ProcessedType extends RawType>
  implements IEntityService<RawType, ProcessedType>
{
  constructor(
    private _repository: IRepository<RawType>,
    private _mapper: (raw: RawType) => ProcessedType
  ) {}

  async getAll(): Promise<{
    data: ProcessedType[];
    error: PostgrestError | null;
  }> {
    const raw = await this._repository.getAll();
    if (raw instanceof PostgrestError) return { data: [], error: raw };
    return { data: (raw as RawType[]).map(this._mapper), error: null };
  }

  async getById(
    id: number
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }> {
    const raw = await this._repository.getById(id);
    if (raw instanceof PostgrestError) return { data: null, error: raw };
    return { data: this._mapper(raw as RawType), error: null };
  }

  async create(
    item: Partial<RawType>
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }> {
    const raw = await this._repository.create(item);
    if (raw instanceof PostgrestError) return { data: null, error: raw };
    return { data: this._mapper(raw as RawType), error: null };
  }

  async update(
    id: number,
    updatedFields: Partial<RawType>
  ): Promise<{ data: ProcessedType | null; error: PostgrestError | null }> {
    const raw = await this._repository.update(id, updatedFields);
    if (raw instanceof PostgrestError) return { data: null, error: raw };
    return { data: this._mapper(raw as RawType), error: null };
  }

  async delete(id: number): Promise<{ error: PostgrestError | null }> {
    const error = await this._repository.delete(id);
    return { error };
  }

  async get<K extends keyof RawType>(
    key: K,
    id: number
  ): Promise<{ data: ProcessedType[K] | null; error: PostgrestError | null }> {
    const raw = await this._repository.get(key, id);
    if (raw instanceof PostgrestError) return { data: null, error: raw };
    return { data: raw as ProcessedType[K], error: null };
  }
}
