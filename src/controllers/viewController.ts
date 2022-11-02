import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

import { Tour } from '../models/tourModel';
import { AppError } from '../utils/appError';

export const getOverview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();

    res.status(200).render('overview', { tours });
  }
);

export const getTour = catchAsync(async (req, res, next) => {
  const [tour] = await Tour.find({ slug: req.params.slug }).populate('reviews');



  if (!tour) {
    return next(new AppError('There is no tour with that name.', 404));
  }
  res.status(200).render('tour', {
    title: tour.name + ' Tour',
    tour,
  });
});

export const getLoginForm = (req: Request, res: Response) => {
  res.status(200).render('login', { title: 'Login' });
};
