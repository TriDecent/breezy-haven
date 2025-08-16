import type {
  DatabaseError,
  UnexpectedError,
  ValidationError,
} from '@/services';

class ErrorHelper {
  handleError(
    errors: DatabaseError | UnexpectedError | ValidationError<unknown>
  ): never {
    switch (errors.type) {
      case 'database':
        throw new Error(`Database error: ${errors.db.message}`);

      case 'unexpected':
        throw new Error(`Unexpected error: ${errors.message}`);

      case 'validation':
        throw new Error(`Validation error: ${JSON.stringify(errors.fields)}`);

      default:
        throw new Error('Unknown error');
    }
  }
}

export const errorHelper = new ErrorHelper();
