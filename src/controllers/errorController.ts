import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const errorSendDev = (err: any, req: Request, res: Response) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const errorSendProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(err.statusCode).json({
      status: 'error',
      message: 'Something went very wrong',
    });
  }
};

const isInProduction = 'production';

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (isInProduction === 'development') {
    errorSendDev(err, req, res);
  } else if (isInProduction === 'production') {
    console.log(err);

    let error = { ...err };
    if (err.stack.indexOf('CastError', 0) === 0) error.name = 'CastError';
    // console.log(err.__proto__.name);
    // console.log(err.name);

    if (error.name === 'CastError') {
      error = handleCastErrorDB(error);
    }
    errorSendProd(error, res);
  }
};
