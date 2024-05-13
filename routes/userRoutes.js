import express from 'express';
import {
    createUser,
    getAllUsers,
    getCurrentUserProfile,
    loginUser,
    logoutUser,
} from '../controllers/userController.js';
import {
    authenticateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

router
    .route('/')
    .post(createUser)
    .get(authenticateUser, authorizeAdmin, getAllUsers);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router.route('/profile').get(authenticateUser, getCurrentUserProfile);

export default router;
