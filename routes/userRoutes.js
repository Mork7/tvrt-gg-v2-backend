import express from 'express';
import {
    createUser,
    getAllUsers,
    getCurrentUserProfile,
    loginUser,
    logoutUser,
    updateCurrentProfile,
    deleteUser,
    getUserById,
    updateUserById,
    getCurrentUserFollowing,
    addSummonerToFollowing,
    removeSummonerFromFollowing,
} from '../controllers/userController.js';
import {
    authenticateUser,
    authorizeAdmin,
} from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/register').post(createUser);
router.route('/login').post(loginUser);
router.route('/logout').post(logoutUser);
router
    .route('/profile')
    .get(authenticateUser, getCurrentUserProfile)
    .put(authenticateUser, updateCurrentProfile);
router
    .route('/following')
    .get(authenticateUser, getCurrentUserFollowing)
    .put(authenticateUser, addSummonerToFollowing)
    .delete(authenticateUser, removeSummonerFromFollowing);

// Admin routes
router.route('/').get(authenticateUser, authorizeAdmin, getAllUsers);
router
    .route('/:id')
    .delete(authenticateUser, authorizeAdmin, deleteUser)
    .get(authenticateUser, authorizeAdmin, getUserById)
    .put(authenticateUser, authorizeAdmin, updateUserById);

export default router;
