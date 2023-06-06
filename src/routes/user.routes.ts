import express from 'express';
import UserController from '../controllers/user.controller';
import authorize from '../middlewares/authorize';
import isAuth from '../middlewares/isAuth';

const userRouter = express.Router();

const controller = new UserController();

/**
 * admin - create,read,update,delete - all users
 * support - create, read, update, delete - normal user
 * user - crete, read, update, delete - user
 */

userRouter.post('/signup', controller.createUserHandler);
userRouter.post('/login', controller.loginUserHandler);

userRouter.delete('/:id', isAuth, authorize, controller.deleteUserHandler);
userRouter.get('/:id', isAuth, authorize, controller.getUserByIdHandler);
userRouter.patch('/:id', isAuth, authorize, controller.updateUserHandler);
userRouter.get('/', isAuth, controller.getAllUsersHandler);

export default userRouter;
