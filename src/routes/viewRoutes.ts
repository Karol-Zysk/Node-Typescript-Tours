import { Router } from 'express';
import { isLoggedIn, protect } from '../controllers/authController';
import {
  getAccount,
  getLoginForm,
  getMyTours,
  getOverview,
  getTour,
  updateUserData,
} from '../controllers/viewController';

const router = Router();

router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.post('/submit-user-data', protect, updateUserData)

export default router;
