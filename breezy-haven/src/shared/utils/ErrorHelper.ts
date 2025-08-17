import type {
  DatabaseError,
  UnexpectedError,
  ValidationError,
} from '@/services';

class ErrorHelper {
  handleError(
    errors: DatabaseError | UnexpectedError | ValidationError<unknown>
  ) {
    switch (errors.type) {
      case 'database':
        return new Error(`Database error: ${errors.db.message}`);

      case 'unexpected':
        return new Error(`Unexpected error: ${errors.message}`);

      case 'validation':
        return new Error(`Validation error: ${JSON.stringify(errors.fields)}`);

      default:
        return new Error('Unknown error');
    }
  }
}

export const errorHelper = new ErrorHelper();
