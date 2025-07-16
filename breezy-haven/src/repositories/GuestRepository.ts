import Repository from './Repository';
import { RawGuest } from './types';

export default class GuestRepository extends Repository<RawGuest> {
  constructor() {
    super('guests');
  }

  // Add any Guest-specific methods here if needed
}
