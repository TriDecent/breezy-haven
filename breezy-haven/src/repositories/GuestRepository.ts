import Repository from './Repository';
import { RawGuest } from './types';

export default class GuestRepository extends Repository<RawGuest> {
  constructor() {
    super('guests');
  }

  // Add any Guest-specific methods here if needed
  async getByEmailAsync(email: string): Promise<RawGuest | null> {
    const guests = await this.getAll();
    if ('code' in guests) return null;

    return guests.find(guest => guest.email === email) ?? null;
  }
}
