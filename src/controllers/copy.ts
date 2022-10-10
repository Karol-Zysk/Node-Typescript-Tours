import { NextFunction, Request, Response } from 'express';

const errorSendDev = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      stack: err.stack,
      envi: process.env.NODE_ENV,
      error: err,
    });
  } else {
    console.error('Error! ', err);
  }
};

const errorSendProd = (err: any, res: Response) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: 'fail',
      message: 'Something went wrong',
    });
  }
};

export const globalErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    errorSendDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    errorSendProd(err, res);
  }
};
