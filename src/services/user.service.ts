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
   * @param {IUser} userData
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
          name: true,
          email: true,
          role: true,
        },
      });

      //return user
      return user;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new AppError(400, 'Email already exists');
        }
      }
    }
  };
}

export default UserService;
