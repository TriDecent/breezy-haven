import Repository from './Repository';
import { RawCabin } from './types';

export default class CabinRepository extends Repository<RawCabin> {
  constructor() {
    super('cabins');
  }

  // Add any Cabin-specific methods here if needed
}
