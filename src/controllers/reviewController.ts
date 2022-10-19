import { NextFunction, Request, Response } from 'express';
import { IreviewDocument, Review } from '../models/reviewModel';
import { catchAsync } from '../utils/catchAsync';

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const newReview: IreviewDocument = await Review.create({
      review: req.body.review,
      rating: req.body.rating,
      tour: req.body.tour,
      user: res.locals.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        reviev: newReview,
      },
    });
  }
);
export const getAllreviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const allRevievs = await Review.find();

    res.status(200).json({
      status: 'success',
      numOfRevievs: allRevievs.length,
      data: {
        revievs: allRevievs,
      },
    });
  }
);
