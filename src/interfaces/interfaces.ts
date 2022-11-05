import { SigningKeyCallback } from 'jsonwebtoken';

export interface EmailOptions {
  email: string;
  subject: string;
  message: string;
}

export interface CurrentUser extends SigningKeyCallback {
  iat: Date;
  id: number;
}

export interface UserInterface {
  _id: string;
  name: string;
  password: string;
  email: string;
  photo?: string;
  role: string;
  passwordConfirmation?: string;
  passwordChangeAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpire?: Date;
  active: boolean;
}
