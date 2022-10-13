import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { promisify } from 'util';
import jwt, { JwtPayload, SigningKeyCallback } from 'jsonwebtoken';
import { AppError } from '../utils/appError';

const signToken = (id: string) =>
  jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE_TIME}`,
  });

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      passwordConfirm: req.body.passwordConfirm,
    });

    const token = signToken(newUser._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user: newUser,
      },
    });
  }
);

export const login = catchAsync(
  async (
    req: Request<{}, {}, { email: string; password: string }>,
    res: Response,
    next: NextFunction
  ) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  }
);

interface newInterface extends SigningKeyCallback {
  iat: Date;
  id: number;
}

export const protect = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //Check if there is token
    let token: string = '';
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in', 401));
    }

    //validate token
    const decoded = await promisify(jwt.verify)(
      token,
      `${process.env.JWT_SECRET}`
    );

    const freshUser = await User.findById((<newInterface>decoded).id);
    if (!freshUser) {
      return next(
        new AppError('user belonging to this token no longer exists', 401)
      );
    }
    if (freshUser.changedPassword((<newInterface>decoded).iat)) {
      next(new AppError('User recently changed password, please log in again', 401));
    }

    res.locals.user = freshUser;
    next();
  }
);
