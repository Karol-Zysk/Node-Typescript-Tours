import { NextFunction, Request, Response } from 'express';
import { Model } from 'mongoose';
import { AppError } from '../utils/appError';
import { catchAsync } from '../utils/catchAsync';

export const deleteOne = (Model: Model<any, {}, {}>) =>
  catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const doc = await Model.findByIdAndDelete(id);

    if (!doc) {
      return next(new AppError('There is no document with this ID', 404));
    }

    res.status(204).json({
      status: 'success',
      data: null,
    });
  });
