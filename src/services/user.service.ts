import { Prisma } from '@prisma/client';
import bcrypt from 'bcryptjs';
import prisma from '../config/prisma';
import IUser from '../interfaces/IUser';
import AppError from '../utils/AppError';

class UserService {
  private prisma;

  constructor() {
    this.prisma = prisma;
  }

  /**
   * This service will create user record in database
   */
  createUser = async (userData: IUser) => {
    try {
      //generate salt and hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(userData.password, salt);

      //create user on database
      const user = await this.prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role ? userData.role : 'user',
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });

      //return user
      return user;
    } catch (error: any) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError(400, 'Email already exists');
        }
      }
      throw new AppError(500, error.message);
    }
  };

  /**
   * This service will login user
   */
  loginUser = async (email: string, candidatePassword: string) => {
    try {
      const user = (await this.getUserByEmail(email)) as IUser;
      //check if user exists
      if (!user) {
        throw new AppError(401, 'Incorrect email or password 1');
      }

      //check if the password is valid
      const isValidPassword = await bcrypt.compare(candidatePassword, user.password);
      if (!isValidPassword) {
        throw new AppError(401, 'Incorrect email or password 2');
      }

      return user;
    } catch (error: any) {
      throw new AppError(404, error.message);
    }
  };

  /**
   * This user service fetches all users from database
   */
  getAllUsers = async () => {
    try {
      const users = await this.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return users;
    } catch (error: any) {
      console.log(error);
      throw new AppError(500, error.message);
    }
  };

  /**
   * This user service fetches a user by id from database
   * @param  {number} id
   * @returns
   */
  getUserById = async (id: number) => {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          id: id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      return user;
    } catch (error: any) {
      throw new AppError(500, error.message);
    }
  };

  /**
   * This user service fetches a user by email from database
   */
  private getUserByEmail = async (email: string) => {
    try {
      const user = await this.prisma.user.findFirst({
        where: {
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          password: true,
        },
      });
      return user;
    } catch (error: any) {
      throw new AppError(500, error.message);
    }
  };

  /**
   * This service function updates a user in database
   */
  updateUser = async (userId: number, userData: IUser) => {
    try {
      const userExists = (await this.getUserById(userId)) as IUser;
      if (!userExists) {
        throw new AppError(404, 'No User exists with the id');
      }

      const updatedUser = await this.prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name: userData.name ?? userExists.name,
          email: userData.email ?? userExists.email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return updatedUser;
    } catch (error: any) {
      console.log(error);
      throw new AppError(error.status, error.message);
    }
  };

  /**
   * This service function deletes users from database
   */

  deleteUser = async (userId: number) => {
    try {
      const userExists = await this.getUserById(userId);
      if (!userExists) {
        throw new AppError(404, 'No User Found with this id to delete');
      }
      return await this.prisma.user.delete({
        where: {
          id: userId,
        },
      });
    } catch (error: any) {
      throw new AppError(500, error.message);
    }
  };
}

export default UserService;
