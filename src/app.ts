import express, { Express, Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import morgan from 'morgan';
import { globalErrorHandler } from './controllers/errorController';
import { CustomError } from './interfaces/ErrorInterface';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import { AppError } from './utils/appError';

export const app: Express = express();

app.use(express.json());
app.use(morgan('dev'));
app.use((req, res, next) => {
  next();
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
