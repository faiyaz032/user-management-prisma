import { RequestHandler } from 'express';
import AppError from '../utils/AppError';

/**
 *This function handle any not found url.
 */
const notFoundMiddleware: RequestHandler = (req, res, next) => {
  return next(
    new AppError(404, `Your requested url '${req.originalUrl} was not found in the server'`)
  );
};

export default notFoundMiddleware;
