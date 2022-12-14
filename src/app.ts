import express, {
  Express,
  Request,
  Response,
  NextFunction,
  urlencoded,
} from 'express';

import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';
import path from 'path';
import pug from 'pug';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import { globalErrorHandler } from './controllers/errorController';
import tourRouter from './routes/tourRoutes';
import userRouter from './routes/userRoutes';
import reviewRouter from './routes/reviewRoutes';
import bookingRouter from './routes/bookingRoutes';
import viewRouter from './routes/viewRoutes';
import { AppError } from './utils/appError';
import { webhookCheckout } from './controllers/bookingController';

export const app: Express = express();

app.set('view engine', 'pug');
app.set('views', path.resolve(process.cwd(), 'src/views'));

app.use(cors());
//serving static files
app.use(express.static(path.resolve(process.cwd(), 'src/public')));

//Set security HTTP headers
app.use(
  helmet({
    contentSecurityPolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: false,
  })
);

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many request from this IP, try again in one hour!',
});
//Limit request from same API
app.use('/api', limiter);

app.post(
  '/webhook-checkout',
  express.raw({ type: 'application/json' }),
  webhookCheckout
);
app.use((req, res, next) => {
  if (req.originalUrl === '/webhook') {
    next(); // Do nothing with the body because I need it in a raw state.
  } else {
    express.json()(req, res, next); // ONLY do express.json() if the received request is NOT a WebHook from Stripe.
  }
});

//Body parser -> reading data from body to req.body
app.use(express.json({ limit: '10kb' }));
app.use(urlencoded({ extended: true, limit: '10kb' }));
app.use(cookieParser());

//Data sanitization against NoSQL  data injection
app.use(mongoSanitize());
//Data sanitization against XSS
app.use(xss());
//Prevent parametr polution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsAverage',
      'ratingsQuantity',
      'maxGroupSize',
      'price',
      'difficulty',
    ],
  })
);
app.use(compression());
app.use((req, res, next) => {
  // console.log(req.cookies);
  next();
});

app.use('/', viewRouter);
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/booking', bookingRouter);

app.all('*', (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);
