import { RequestHandler } from 'express';
import AppError from '../utils/AppError';

/**
 * This middleware function check if the user has cookie with his request. If user has cookies then the request is authenticated
 */
const isAuth: RequestHandler = async (req, res, next) => {
  if (!req.session.user) {
    return next(new AppError(401, 'You are not authenticated'));
  }
  return next();
};

export default isAuth;
