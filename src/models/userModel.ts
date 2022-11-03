import mongoose, { Document, HookNextFunction, Schema } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { IUserDocument } from '../interfaces/userModelInterfaces';

const userScheema: Schema<IUserDocument> = new mongoose.Schema({
  name: { type: String, required: [true, 'Name is required'], unique: true },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'this email already exist'],
    lowercase: true,
    validate: [validator.isEmail, 'Please provide a valid email'],
  },
  role: {
    type: String,
    default: 'user',
    enum: ['user', 'guide', 'lead-guide', 'admin'],
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
  passwordChangedAt: {
    type: Date,
  },
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    select: false,
    default: true,
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

userScheema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();
  //@ts-ignore
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

//@ts-ignore
userScheema.pre(/^find/, function (this: any, next) {
  //This points to the querry
  this.find({ active: { $ne: false } });
  next();
});

//Check if password given by user is equal to password from DB
userScheema.methods.correctPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

//Check if user currently change password
userScheema.methods.changedPassword = async function (JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    let changedTimeStamp = this.passwordChangedAt.getTime() / 1000;
    changedTimeStamp = parseInt(changedTimeStamp.toString(), 10);

    return JWTTimestamp < changedTimeStamp;
  }

  return false;
};

//creating password reset token, valid for 10min
userScheema.methods.userPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

export const User = mongoose.model<IUserDocument>('User', userScheema);
