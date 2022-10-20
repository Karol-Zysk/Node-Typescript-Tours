import { ObjectId } from 'mongoose';

export enum Roles {
  ADMIN = 'admin',
  USER = 'user',
  GUIDE = 'guide',
  LEAD_GUIDE = 'lead-guide',
}

export interface IUser {
  _id?: ObjectId | string;
  name: string;
  email: string;
  role: Roles;
  photo: string;
  password: string | undefined;
  passwordConfirm: string;
  passwordChangedAt: Date | undefined;
  passwordResetToken: string | undefined;
  passwordResetExpires: Date | number | undefined;
}

export interface IUserDocument extends IUser {
  correctPassword: (
    password: string | undefined,
    userPassword: string | undefined
  ) => Promise<boolean>;
  changedPassword: (JWTTimestamp: Date) => Promise<boolean>;
  userPasswordResetToken: () => Promise<string>;
}
