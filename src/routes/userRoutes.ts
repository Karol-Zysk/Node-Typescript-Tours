import express from 'express';
import {
  createUser,
  deleteMe,
  deleteUser,
  getAllUsers,
  getUser,
  updateMe,
} from '../controllers/userController';
import {
  forgotPassword,
  login,
  protect,
  resetPassword,
  signUp,
  updatePassword,
} from '../controllers/authController';
const router = express.Router();

router.post('/signup', signUp);
router.post('/login', login);
router.post('/forgotpassword', forgotPassword);
router.patch('/resetpassword/:token', resetPassword);

router.use(protect);
router.patch('/updatepassword', updatePassword);
router.patch('/updateme', updateMe);
router.delete('/deleteme', deleteMe);

router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser);

export default router;
