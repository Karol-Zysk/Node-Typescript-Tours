import { NextFunction, Request, Response } from 'express';
import { IUserDocument, User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';
import { promisify } from 'util';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/appError';
import { CurrentUser } from '../interfaces/interfaces';
import { sendEmail } from '../utils/email';
import crypto from 'crypto';

const signToken = (id: string) =>
  jwt.sign({ id }, `${process.env.JWT_SECRET}`, {
    expiresIn: `${process.env.JWT_EXPIRE_TIME}`,
  });

const createSendToken = (
  user: IUserDocument,
  statusCode: number,
  res: Response
) => {
  const token = signToken(user._id);

  const cookieOptions = {
    expires: new Date(
      Date.now() +
        Number(`${process.env.JWT_COOKIE_EXPIRES_IN}`) * 24 * 60 * 60 * 1000
    ),
    secure: false,
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);
//Remove password from output
  user.password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

export const signUp = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, email, password, passwordConfirm }: IUserDocument = req.body;
    const newUser = await User.create({
      name,
      email,
      password,
      passwordConfirm,
    });

    createSendToken(newUser, 201, res);
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

    const user: IUserDocument = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
      return next(new AppError('incorrect email or password', 401));
    }

    createSendToken(user, 200, res);
  }
);

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
      token, //@ts-ignore
      `${process.env.JWT_SECRET}`
    );

    const currentUser = await User.findById((<CurrentUser>decoded).id);
    if (!currentUser) {
      return next(
        new AppError('user belonging to this token no longer exists', 401)
      );
    }
    //set promise to variable to return only boolean value
    const isPasswordChanged = await currentUser.changedPassword(
      (<CurrentUser>decoded).iat
    );

    if (isPasswordChanged) {
      next(
        new AppError('User recently changed password, please log in again', 401)
      );
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    //SET USER DATA TO USE IN MIDDLEWARE
    res.locals.user = currentUser;
    next();
  }
);

//NICE TRICK
//SETTING VARIABLES TO MIDDLEWARE
export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    //CHECK IF USER HAS THE ROLE
    if (!roles.includes(res.locals.user.role)) {
      return next(new AppError('You do not have permission to do this', 403));
    }
    next();
  };
};

export const forgotPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    //Get user based on posted email
    const user: IUserDocument = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new AppError('There is no user with this email', 404));
    }
    //Generate random reset token
    const resetToken = user.userPasswordResetToken();

    await user.save({ validateBeforeSave: false });

    const resetURL = `${req.protocol}://${req.get(
      'host'
    )}/api/v1/users/resetpassword/${resetToken}`;

    const message = `Forgot password ? Submit patch request with new password and password confirm to ${resetURL}.\ Otherwise ignore this message`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Your password reset token (valid for 10 min)',
        message,
      });

      res.status(200).json({
        status: 'success',
        message: `token sent  to ${user.email}`,
      });
    } catch (err) {
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      await user.save({ validateBeforeSave: false });

      return next(
        new AppError('There was a problem sending email. Try again later', 500)
      );
    }
  }
);

export const resetPassword = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const hashedToken = crypto
      .createHash('sha256')
      .update(req.params.token)
      .digest('hex');

    const user: IUserDocument = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      next(new AppError('not valid or expired reset token', 400));
    }

    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    createSendToken(user, 200, res);
  }
);

export const updatePassword = catchAsync(
  async (
    req: Request<
      {},
      {},
      {
        password: string;
        passwordConfirm: string;
        passwordCurrent: string;
      }
    >,
    res: Response,
    next: NextFunction
  ) => {
    const { password, passwordConfirm, passwordCurrent } = req.body;

    const user: IUserDocument = await User.findOne(res.locals.user._id).select(
      '+password'
    );

    if (
      !user ||
      !(await user.correctPassword(passwordCurrent, user.password))
    ) {
      return next(new AppError('incorrect email or password', 401));
    }

    user.password = password;
    user.passwordConfirm = passwordConfirm;
    await user.save();

    createSendToken(user, 200, res);
  }
);
