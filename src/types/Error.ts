export class ApiError extends Error {
  type?: string;
  statusCode?: number;
  message: string;

  constructor({
    type,
    statusCode,
    message,
  }: {
    type?: string;
    statusCode?: number;
    message?: string;
  }) {
    super(message);
    this.type = type;
    this.statusCode = statusCode;
    this.message = message || 'An error occurred';
  }
}
