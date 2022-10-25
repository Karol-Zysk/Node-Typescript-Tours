import { NextFunction, Request, Response } from 'express';
import { Review } from '../models/reviewModel';
import { createOne, deleteOne, getAll, getOne, updateOne } from './handlerFactory';

export const setTourUserIDs = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.body.tour) req.body.tour = req.params.tourId;
  if (!req.body.user) req.body.user = res.locals.user._id;

  next();
};
export const getAllreviews = getAll(Review);
export const getOneReview = getOne(Review);
export const createReview = createOne(Review);
export const updateReview = updateOne(Review);
export const deleteReview = deleteOne(Review);
