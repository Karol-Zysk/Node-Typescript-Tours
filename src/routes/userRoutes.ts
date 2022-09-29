import  express  from "express";
import { createUser, deleteUser, getAllUsers, getUser } from "../controllers/userControllers";
const router = express.Router();


router.route('/').get(getAllUsers).post(createUser);
router.route('/:id').get(getUser).delete(deleteUser);

export default router