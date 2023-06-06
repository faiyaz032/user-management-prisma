import express from 'express';
import UserController from '../controllers/user.controller';
import authorize from '../middlewares/authorize';
import isAuth from '../middlewares/isAuth';

const userRouter = express.Router();

const controller = new UserController();

//authentication routes
userRouter.post('/signup', controller.createUserHandler);
userRouter.post('/login', controller.loginUserHandler);

userRouter.delete('/:id', isAuth, authorize, controller.deleteUserHandler);
userRouter.get('/:id', isAuth, authorize, controller.getUserByIdHandler);
userRouter.patch('/:id', isAuth, authorize, controller.updateUserHandler);
userRouter.get('/', isAuth, controller.getAllUsersHandler);

//user verification routes
userRouter.get('/verification/:id', controller.verificationCodeHandler);
userRouter.patch('/verify/:id', controller.verifyUserHandler);

export default userRouter;
