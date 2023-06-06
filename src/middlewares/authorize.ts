import { RequestHandler } from 'express';
import IUser from '../interfaces/IUser';
import UserService from '../services/user.service';
import AppError from '../utils/AppError';

/**
 * Instantiate user service
 */
const userService = new UserService();

/**
 * This handler will handle the authorization of routes
 */
const authorize: RequestHandler = async (req, res, next) => {
  const { role: requestedRole } = req.session.user as IUser;
  try {
    const correspondingUser = (await userService.getUserById(Number(req.params.id))) as IUser;

    if (requestedRole === 'admin') {
      //if the requested role is admin then he can do operations in any role
      return next();
    }
    if (requestedRole === 'support' && correspondingUser.role === 'user') {
      return next();
    }
    if (requestedRole === 'user' && correspondingUser.role == 'user') {
      return next();
    }

    return next(new AppError(401, 'You are not authorized'));
  } catch (error: any) {
    console.log(error);
    next(new AppError(401, error.message));
  }
};

export default authorize;
