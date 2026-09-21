import { DTOGuest } from '@/repositories';

import type { Guest, NullableGuest } from '@/shared/schemas';
import type { PostgrestError } from '@supabase/supabase-js';
import { IService } from './BaseService';

export default class GuestService<T extends Guest | NullableGuest>
  implements IService<DTOGuest, T>
{
  constructor(private readonly _service: IService<DTOGuest, T>) {}
  handleRepositoryResultArray(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResultArray(action);
  }
  handleRepositoryResult(
    action: () => Promise<{ data: unknown; error: PostgrestError | null }>
  ) {
    return this._service.handleRepositoryResult(action);
  }
  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }
  getAll() {
    return this._service.getAll();
  }
  getById(id: number) {
    return this._service.getById(id);
  }
  create(item: Partial<DTOGuest>) {
    return this._service.create(item);
  }
  update(id: number, updatedFields: Partial<DTOGuest>) {
    return this._service.update(id, updatedFields);
  }
  delete(id: number) {
    return this._service.delete(id);
  }

  async getByEmailAsync(email: string): Promise<T | null> {
    await this._service.verifyPermission();

    const { data: guests, errors } = await this.getAll();
    if (errors || !guests) return null;

    return guests.find(guest => guest.email === email) ?? null;
  }
}
