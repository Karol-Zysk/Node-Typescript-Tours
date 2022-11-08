import { NextFunction, Request, Response } from 'express';
import { catchAsync } from '../utils/catchAsync';

import { Tour } from '../models/tourModel';
import { AppError } from '../utils/appError';
import { User } from '../models/userModel';
import { Booking } from '../models/bookingModel';

export const getOverview = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const tours = await Tour.find();

    res.status(200).render('overview', { tours, title: 'All Tours' });
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

export const getSignUpForm = (req: Request, res: Response) => {
  res.status(200).render('signup', { title: 'Sign Up' });
};

export const getAccount = (req: Request, res: Response) => {
  res.status(200).render('account', { title: 'Account' });
};

export const getMyTours = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    const bookings = await Booking.find({ user: res.locals.user._id });
    console.log(bookings.tour + 'elo');
    const tourIDs = bookings.map((el: { tour: any }) => el.tour);
    const tours = await Tour.find({ _id: { $in: tourIDs } });
    console.log(tours);

    res.status(200).render('overview', {
      title: 'All Tours',
      tours,
    });
  }
);

export const updateUserData = catchAsync(async (req, res, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    res.locals._id,
    {
      name: req.body.name,
      email: req.body.email,
    },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

export const forgotPassword = (req: Request, res: Response) => {
  res.status(200).render('forgotpassword', {
    title: 'Forgot Password?',
  });
};

export const resetPassword = (req: Request, res: Response) => {
  res.status(200).render('resetpassword', {
    title: 'Reset Password',
    resetToken: req.params.resetToken,
  });
};
