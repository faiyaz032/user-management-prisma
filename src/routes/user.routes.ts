import express from 'express';
import UserController from '../controllers/user.controller';

const userRouter = express.Router();

const controller = new UserController();

userRouter.post('/signup', controller.createUserHandler);

userRouter.get('/:id', controller.getUserByIdHandler);
userRouter.get('/', controller.getAllUsersHandler);

export default userRouter;
