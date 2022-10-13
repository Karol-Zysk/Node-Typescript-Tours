import { Request, Response } from 'express';
import { User } from '../models/userModel';
import { catchAsync } from '../utils/catchAsync';

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
export const deleteUser = (req: Request, res: Response) => {
  if (Number(req.params.id) > 5) {
    return res.status(404).json({
      status: 'fail',
      message: 'no tour with this ID',
    });
  } else
    res.status(204).json({
      status: 'success',
      data: null,
    });
};
