import { Router } from 'express';
import { protect, restrictTo } from '../controllers/authController';
import {
  createReview,
  deleteReview,
  getAllreviews,
  getOneReview,
  setTourUserIDs,
  updateReview,
} from '../controllers/reviewController';
import { Roles } from '../interfaces/userModelInterfaces';

const router = Router({ mergeParams: true });
router.use(protect);
router
  .route('/:id')
  .delete(deleteReview)
  .patch(restrictTo(Roles.USER, Roles.ADMIN), updateReview)
  .get(getOneReview);

router
  .route('/')
  .get(getAllreviews)
  .post(
    protect,
    restrictTo(Roles.USER, Roles.ADMIN),
    setTourUserIDs,
    createReview
  );

export default router;
