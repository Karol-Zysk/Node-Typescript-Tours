import express from 'express';
import { protect, restrictTo } from '../controllers/authController';
import {
  aliasTopTour,
  createTour,
  deleteTour,
  getAllTours,
  getDistancesByLatLang,
  getMonthlyPlan,
  getTour,
  getTourStats,
  getToursWithin,
  resizeTourImages,
  updateTour,
  uploadTourImages,
} from '../controllers/tourController';
import reviewRouter from './reviewRoutes';
import { Roles } from '../interfaces/userModelInterfaces';

const router = express.Router();

router.use('/:tourId/reviews', reviewRouter);

router.route('/top-5-cheap').get(aliasTopTour, getAllTours);
router.route('/get-stats').get(getTourStats);
router
  .route('/busy-month/:year')
  .get(
    protect,
    restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE, Roles.LEAD_GUIDE, Roles.GUIDE),
    getMonthlyPlan
  );

router
  .route('/tours-within/:distance/center/:latlng/unit/:unit')
  .get(getToursWithin);

router.route('/distances/:latlng/unit/:unit').get(getDistancesByLatLang);

router
  .route('/:id')
  .get(getTour)
  .patch(
    protect,
    restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE, Roles.LEAD_GUIDE),
    uploadTourImages,
    resizeTourImages,
    updateTour
  )
  .delete(
    protect,
    restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE, Roles.LEAD_GUIDE),
    deleteTour
  );
router
  .route('/')
  .get(protect, getAllTours)
  .post(protect, restrictTo(Roles.ADMIN), createTour);

export default router;
