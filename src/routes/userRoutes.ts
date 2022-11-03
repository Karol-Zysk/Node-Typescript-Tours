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
  uploadUserPhoto,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  logout,
  protect,
  resetPassword,
  restrictTo,
  signUp,
  updatePassword,
} from '../controllers/authController';
import { Roles } from '../interfaces/userModelInterfaces';
import multer from 'multer';

const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.use(protect);
router.patch('/updatemypassword', updatePassword);
router.get('/me', getMe, getUser);
router.patch('/updateme', uploadUserPhoto, updateMe);
router.delete('/deleteme', deleteMe);

router.use(
  restrictTo(Roles.ADMIN, Roles.LEAD_GUIDE, Roles.LEAD_GUIDE, Roles.USER)
);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser).patch(updateUser);

export default router;
