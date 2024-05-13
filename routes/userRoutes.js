import express from 'express';
import { createUser } from '../controllers/userController.js';
import {
    authenictateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/').post(createUser);


export default router;