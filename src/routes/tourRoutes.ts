import express from 'express';
import {
  checkBody,
  checkId,
  createTour,
  deleteTour,
  getAllTours,
  getTour,
  updateTour,
} from '../controllers/tourControllers';
export const router = express.Router();

router.param('id', checkId);

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(checkBody, createTour);

export default router;
