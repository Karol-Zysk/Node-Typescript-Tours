import { NextFunction, Request, Response } from 'express';
import { ICatchAsync } from '../interfaces/catchAsyncInterface';

export const catchAsync = (fn: ICatchAsync) => {
  return (req: Request, res: Response, next: NextFunction) => {
    fn(req, res, next).catch(next);
  };
};
