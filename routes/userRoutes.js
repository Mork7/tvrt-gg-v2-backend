import express from 'express';
import { createUser, loginUser, logoutUser } from '../controllers/userController.js';
import {
    authenictateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser);
router.route('/login').get(loginUser);
router.route('/logout').get(logoutUser);

export default router;
