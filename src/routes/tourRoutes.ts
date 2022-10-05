import express from 'express';
import {
  aliasTopTour,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from '../controllers/tourControllers';

export const router = express.Router();

router.route('/top-5-cheap').get(aliasTopTour, getAllTours);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(createTour);

export default router;
