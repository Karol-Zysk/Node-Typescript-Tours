import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import {
  createReview,
  deleteReview,
  getAllreviews,
} from '../controllers/reviewController';
import { Roles } from '../interfaces/userModelInterfaces';

const router = Router({ mergeParams: true });
router.route('/:id').delete(deleteReview);

router
  .route('/')
  .get(getAllreviews)
  .post(protect, restrictTo(Roles.USER, Roles.ADMIN), createReview);

export default router;
