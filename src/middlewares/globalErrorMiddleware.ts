import { ErrorRequestHandler } from 'express';
import { Response } from 'express-serve-static-core';

const sendDevError = (error: any, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendProductionError = (error: any, res: Response) => {
  res.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

/**
 * This functions handle all the global error from any where of the codebase.
 */
const globalErrorMiddleware: ErrorRequestHandler = (error, req, res, next) => {
  error.status = error.status || 'error';
  error.statusCode = error.statusCode || 500;

  if (process.env.NODE_ENV === 'production') sendProductionError(error, res);
  else sendDevError(error, res);
};

export default globalErrorMiddleware;
