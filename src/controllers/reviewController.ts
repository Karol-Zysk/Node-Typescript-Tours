import { NextFunction, Request, Response } from 'express';
import { IReviewDocument, Review } from '../models/reviewModel';
import { catchAsync } from '../utils/catchAsync';
import { deleteOne } from './handlerFactory';

export const createReview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    if (!req.body.tour) req.body.tour = req.params.tourId;
    if (!req.body.user) req.body.user = res.locals.user._id;
    const newReview: IReviewDocument = await Review.create(req.body);

    res.status(201).json({
      status: 'success',
      data: {
        review: newReview,
      },
    });
  }
);
export const getAllreviews = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };

    const allRevievs = await Review.find(filter);

    res.status(200).json({
      status: 'success',
      numOfRevievs: allRevievs.length,
      data: {
        revievs: allRevievs,
      },
    });
  }
);

export const deleteReview = deleteOne(Review);
