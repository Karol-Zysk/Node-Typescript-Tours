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
