import mongoose, { Document, HookNextFunction, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userScheema: Schema<IUserDocument> = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], unique: true },
  user: { type: String },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'this email already exist'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  passwordChangedAt: {
    type: Date,
    default: Date.now(),
    required: [true, 'Please provide a changedAt'],
  },
  photo: { type: String },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 8,
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: true,
    // WORKS ONLY ON CREATE AND SAVE
    validate: [
      function (this: { password: string }, el: string) {
        return el === this.password;
      },
      'password and confirmation password must be the same',
    ],
  },
});

userScheema.pre(
  'save',
  async function (
    this: {
      isModified: (password: string) => boolean;
      password: string;
      passwordConfirm: string | undefined;
    },
    next: HookNextFunction
  ) {
    // Run this function only when password is modified
    if (!this.isModified('password')) return next();

    // Hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);

    // Delete password confirm field
    this.passwordConfirm = undefined;
    next();
  }
);

//Check if password given by user is equal to password from DB
userScheema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

interface IUser {
  passwordChangedAt: Date;
}

interface IUserDocument extends IUser, Document {
  changedPassword: () => Promise<boolean>;
}
//Check if user currently change password
userScheema.methods.changedPassword = async function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = this.passwordChangedAt.getTime() / 1000;

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

export const User = mongoose.model('User', userScheema);
