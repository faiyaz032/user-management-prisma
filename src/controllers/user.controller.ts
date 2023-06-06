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

  /**
   * This function handles user login
   */

  loginUserHandler: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return next(new AppError(400, 'Please attach email and password'));
    }
    try {
      const user = await this.service.loginUser(email, password);

      //save the session on database
      req.session.user = {
        id: user.id,
        email: user.email,
        role: user.role,
      };

      //send response
      return res.status(200).json({ status: 'success', message: 'user logged in successfully' });
    } catch (error: any) {
      next(new AppError(error.statusCode, error.message));
    }
  };

  /**
   * This request handler function will handle get all users
   */

  getAllUsersHandler: RequestHandler = async (req, res, next) => {
    try {
      const users = await this.service.getAllUsers();
      return res.status(200).json({
        status: 'success',
        message: 'all users fetched successfully',
        users,
      });
    } catch (error: any) {
      console.log(error);
      next(new AppError(500, error.message));
    }
  };

  /**
   * This request handler function handles get user by id
   */
  getUserByIdHandler: RequestHandler = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
      return next(new AppError(400, 'Please attach id in the url param'));
    }
    try {
      const user = await this.service.getUserById(Number(id));
      if (!user) {
        return next(new AppError(404, `No user found with id:${id}`));
      }
      return res.status(200).json({
        status: 'success',
        message: `user with id:${id} fetched fetched successfully`,
        user,
      });
    } catch (error: any) {
      console.log(error);
      next(new AppError(error.code, error.message));
    }
  };

  /**
   * This request handler function handles updating user
   */

  updateUserHandler: RequestHandler = async (req, res, next) => {
    const { id: userId } = req.params;
    const { name, email } = req.body;

    if (!userId) {
      return next(new AppError(400, 'Please attach user id in the param'));
    }

    try {
      const updatedUser = await this.service.updateUser(Number(userId), req.body);
      console.log(
        '🚀 ~ file: user.controller.ts:98 ~ UserController ~ updateUser:RequestHandler= ~ updatedUser:',
        updatedUser
      );

      return res.status(200).json({
        status: 'success',
        message: 'User Updated succesfully',
        updatedUser,
      });
    } catch (error: any) {
      next(new AppError(error.status, error.message));
    }
  };

  /**
   * This request handler function handles deleting user
   */
  deleteUserHandler: RequestHandler = async (req, res, next) => {
    const { id: userId } = req.params;
    if (!userId) {
      return next(new AppError(400, 'Please attach the id with url param'));
    }
    try {
      await this.service.deleteUser(Number(userId));
      return res.status(200).json({
        status: 'success',
        message: 'user deleted successfully',
      });
    } catch (error: any) {
      next(new AppError(500, error.message));
    }
  };
}

export default UserController;
