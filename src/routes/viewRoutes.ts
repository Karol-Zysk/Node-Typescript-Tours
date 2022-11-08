import { Router } from 'express';
import { isLoggedIn, protect } from '../controllers/authController';
import {
  forgotPassword,
  getAccount,
  getLoginForm,
  getMyTours,
  getOverview,
  getSignUpForm,
  getTour,
  resetPassword,
  updateUserData,
} from '../controllers/viewController';

const router = Router();

router.get('/signup', isLoggedIn, getSignUpForm);
router.get('/', isLoggedIn, getOverview);
router.get('/tour/:slug', isLoggedIn, getTour);
router.get('/login', isLoggedIn, getLoginForm);
router.get('/me', protect, getAccount);
router.get('/my-tours', protect, getMyTours);

router.get('/forgotpassword', forgotPassword);
router.get('/resetpassword/:resetToken', resetPassword);

router.post('/submit-user-data', protect, updateUserData);

export default router;
