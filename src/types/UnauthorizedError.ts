import { ApiError } from './Error';

export class UnauthorizedError extends ApiError {
  constructor() {
    super({
      message: 'You do not have permission to access this resource.',
      statusCode: 403,
    });
  }
}
