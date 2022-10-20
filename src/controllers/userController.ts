import { NextFunction, Request, Response } from 'express';
import { User } from '../models/userModel';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';
import { filterObj } from '../utils/filterBody';
import { deleteOne } from './handlerFactory';

export const getAllUsers = catchAsync(async (req: Request, res: Response) => {
  const userList = await User.find();

  res.status(200).json({
    message: 'user list',
    results: userList.length,
    data: {
      users: userList,
    },
  });
});

export const getUser = (req: Request, res: Response) => {
  res.status(200).json({
    message: 'user',
  });
};
export const createUser = (req: Request, res: Response) => {
  res.status(201).json({
    message: 'user created',
  });
};

export const updateMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (req.body.password || req.body.passwordConfirm) {
      return next(new AppError("You can't update password here", 400));
    }
    //Filter not allowed field names
    const filteredBody = filterObj(req.body, 'name', 'email');
    //Update User
    const updatedUser = await User.findByIdAndUpdate(
      res.locals.user._id,
      filteredBody,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      status: 'success',
      body: {
        user: updatedUser,
      },
    });
  }
);

export const deleteMe = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(res.locals.user._id, { active: false });

    res.status(204).json({
      status: 'success',
      data: null,
    });
  }
);

export const deleteUser = deleteOne(User);
