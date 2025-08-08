import { DTOGuest } from '@/repositories';
import { PostgrestError } from '@supabase/supabase-js';
import { IService, ServiceReturnType } from './BaseService';

export default class GuestService implements IService<DTOGuest> {
  constructor(private readonly _service: IService<DTOGuest>) {}

  verifyPermission(): Promise<void> {
    return this._service.verifyPermission();
  }

  getAll(): ServiceReturnType<DTOGuest[], PostgrestError | null> {
    return this._service.getAll();
  }
  getById(
    id: number
  ): ServiceReturnType<DTOGuest | null, PostgrestError | null> {
    return this._service.getById(id);
  }
  create(
    item: Partial<DTOGuest>
  ): ServiceReturnType<DTOGuest | null, PostgrestError | null> {
    return this._service.create(item);
  }
  update(
    id: number,
    updatedFields: Partial<DTOGuest>
  ): ServiceReturnType<DTOGuest | null, PostgrestError | null> {
    return this._service.update(id, updatedFields);
  }
  delete(
    id: number
  ): ServiceReturnType<DTOGuest | null, PostgrestError | null> {
    return this._service.delete(id);
  }

  async getByEmailAsync(email: string): Promise<DTOGuest | null> {
    await this._service.verifyPermission();

    const { data: guests, error } = await this.getAll();
    if (error || !guests) return null;

    return guests.find(guest => guest.email === email) ?? null;
  }
}
