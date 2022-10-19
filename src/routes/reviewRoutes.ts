import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import { createReview, getAllreviews } from '../controllers/reviewController';

const router = Router();

router
  .route('/')
  .get(getAllreviews)
  .post(protect, restrictTo('user'), createReview);

export default router;
