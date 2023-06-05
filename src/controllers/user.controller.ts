import { RequestHandler } from 'express';
import IUser from '../interfaces/IUser';
import UserService from '../services/user.service';
import AppError from '../utils/AppError';

class UserController {
  private service;

  constructor() {
    this.service = new UserService();
  }

  /**
   * This request handler function will handle user creation
   */
  createUserHandler: RequestHandler = async (req, res, next) => {
    //request validation
    const { name, email, password, role } = req.body as IUser;

    if (!name || !email || !password) {
      return next(new AppError(400, 'name, email and password must be required'));
    }

    try {
      //pass the user creation to service
      const user = await this.service.createUser(req.body);
      //return response
      return res.status(201).json({
        status: 'success',
        message: 'user created successfully',
        user,
      });
    } catch (error: any) {
      next(new AppError(500, error.message));
    }
  };
}

export default UserController;
