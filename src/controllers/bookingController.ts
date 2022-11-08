import Stripe from 'stripe';

import { Booking } from '../models/bookingModel';
import { User } from '../models/userModel';
import { Tour } from '../models/tourModel';

import { NextFunction, Request, Response } from 'express';
import {
  createOne,
  deleteOne,
  getAll,
  getOne,
  updateOne,
} from './handlerFactory';
import { catchAsync } from '../utils/catchAsync';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2022-08-01',
});

export const getCheckoutSession = catchAsync(async (req, res, next) => {
  // 1) Get the currently booked tour
  const tour = await Tour.findById(req.params.tourId);
  if (tour) {
    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      // success_url: `${req.protocol}://${req.get('host')}/my-tours/?tour=${
      //   req.params.tourId
      // }&user=${req.user.id}&price=${tour.price}`,
      success_url: `${req.protocol}://${req.get('host')}$/api/v1/booking?tour=${
        req.params.tourId
      }&user=${res.locals.user._id}&price=${tour?.price}`,
      cancel_url: `${req.protocol}://${req.get('host')}/tour/${tour?.slug}`,
      customer_email: res.locals.user.email,
      client_reference_id: req.params.tourId,
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: tour?.price ? tour?.price * 100 : 0,
            product_data: {
              name: `${tour?.name} Tour`,
              description: tour?.summary,
              images: [`https://www.natours.dev/img/tours/${tour?.imageCover}`],
            },
          },
          quantity: 1,
        },
      ],
    });

    // 3) Create session as response
    res.status(200).json({
      status: 'success',
      session,
    });
  } else {
    res.status(404).json({
      status: 'fail',
    });
  }
});

const createBookingCheckout = async (session: any) => {
  const tour = session.client_reference_id;
  //@ts-ignore
  const user = (await User.findOne({ email: session.customer_email })).id;
  const price = session.display_items[0].amount / 100;
  await Booking.create({ tour, user, price });
};

export const webhookCheckout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const signature = req.headers['stripe-signature'];

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed')
    createBookingCheckout(event.data.object);

  res.status(200).json({ received: true });
};

export const createBooking = createOne(Booking);
export const getBooking = getOne(Booking);
export const getAllBookings = getAll(Booking);
export const updateBooking = updateOne(Booking);
export const deleteBooking = deleteOne(Booking);