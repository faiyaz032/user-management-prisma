class AppError extends Error {
  statusCode: number;
  status: string;

  constructor(statusCode: number, message: string) {
    super(message);

    this.statusCode = statusCode;
    this.status = `${this.statusCode}`.startsWith('4') ? 'fail' : 'success';

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
