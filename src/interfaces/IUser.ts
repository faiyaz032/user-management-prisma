interface IUser {
  id: number;
  name: string;
  email: string;
  password: string;
  role?: string;
  verified?: boolean;
  verificationCode?: string;
  passwordResetCode?: string;
}

export default IUser;
