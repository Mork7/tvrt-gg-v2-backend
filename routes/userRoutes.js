import express from 'express';
import { createUser, getAllUsers, loginUser, logoutUser } from '../controllers/userController.js';
import {
    authenictateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser).get(authenictateUser, authorizeAdmin, getAllUsers)
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);

export default router;
