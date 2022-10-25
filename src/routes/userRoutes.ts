import express from 'express';
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
  updateUser,
  getMe,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  restrictTo,
  signUp,
  updatePassword,
} from '../controllers/authController';
import { Roles } from '../interfaces/userModelInterfaces';
import { app } from '../app';
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.use(protect);
router.patch('/updatepassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateme', updateMe);
router.delete('/deleteme', deleteMe);

router.use(
  restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE, Roles.LEAD_GUIDE, Roles.USER)
);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

export default router;
