import { NextFunction, Request, Response } from 'express';
import { AppError } from '../utils/appError';

const handleCastErrorDB = (err: any) => {
  const message = `Invalid ${err.path}: ${err.value}.`;

  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err: any) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  console.log(value);

  const message = `Duplicate field value: ${value}. Please use another value!`;
  return new AppError(message, 400);
};
const handleValidationErrorDB = (err: any) => {
  const errors = Object.values(err.errors).map((el) => {
    if (el instanceof Error) {
      el.message;
    }
  });

  const message = `Invalid input data. ${errors.join('. ')}`;
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
    console.error('ERROR 💥', err);
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

    let error = Object.create(err);

    // Functions to transform mongoose errors into meaningful ones.
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateFieldsDB(error);
    if (err.name === `ValidationError`) error = handleValidationErrorDB(error);

    errorSendProd(error, res);
  }
};
