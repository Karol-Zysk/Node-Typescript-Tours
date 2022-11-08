import express from 'express';
import {
  createBooking,
  deleteBooking,
  getAllBookings,
  getBooking,
  getCheckoutSession,
  updateBooking,
} from '../controllers/bookingController';
import { protect, restrictTo } from '../controllers/authController';
import { Roles } from '../interfaces/userModelInterfaces';

const router = express.Router();

router.use(protect);

router.get('/checkout-session/:tourId', getCheckoutSession);

router.use(restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE));

router.route('/').get(getAllBookings).post(createBooking);

router.route('/:id').get(getBooking).patch(updateBooking).delete(deleteBooking);

export default router;
