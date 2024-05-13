import express from 'express';
import { createUser, loginUser } from '../controllers/userController.js';
import {
    authenictateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser);
router.route('/login').get(loginUser);

export default router;
