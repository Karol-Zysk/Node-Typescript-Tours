import express from 'express';
import { protect, restrictTo } from '../controllers/authController';
import {
  aliasTopTour,
  createTour,
  deleteTour,
  getAllTours,
  getMonthlyPlan,
  getTour,
  getTourStats,
  updateTour,
} from '../controllers/tourController';
import reviewRouter from './reviewRoutes';
import { Roles } from '../interfaces/userModelInterfaces';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTour, getAllTours);
router.route('/get-stats').get(getTourStats);
router.route('/busy-month/:year').get(getMonthlyPlan);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE), deleteTour);
router.route('/').get(protect, getAllTours).post(createTour);

export default router;
