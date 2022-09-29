import express from 'express';
import { createTour, deleteTour, getAllTours, getTour, updateTour } from '../controllers/tourControllers';
export const router = express.Router();

router.route('/:id').get(getTour).patch(updateTour).delete(deleteTour);
router.route('/').get(getAllTours).post(createTour);

export default router
