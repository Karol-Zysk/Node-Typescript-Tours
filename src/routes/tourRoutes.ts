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

export const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTour, getAllTours);
router.route('/get-stats').get(getTourStats);
router.route('/busy-month/:year').get(getMonthlyPlan);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);
router.route('/').get(protect, getAllTours).post(createTour);

export default router;
