import { Router } from 'express';
import { isLoggedIn } from '../controllers/authController';
import {
  getLoginForm,
  getOverview,
  getTour,
} from '../controllers/viewController';

const router = Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/tour/:slug', getTour);
router.get('/login', getLoginForm);

export default router;
