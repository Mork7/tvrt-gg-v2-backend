import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

// This middleware function is used to authenticate the user
const authenticateUser = asyncHandler(async (req, res, next) => {
    // console.log('Cookies:', req.cookies); // Log all cookies
    // read the token from the cookies
    // I accidentally wrote req.cookie.jwt instead of req.cookies.jwt; I forgot the 's' in cookies, future Mark: don't forget again 🤪
    const token = req.cookies.jwt;

    // If the token exists in the cookie then verify the token and extract the userId from it and attach it to the request object as req.user so that it can be accessed in the next middleware function or route handler function that uses this middleware function
    if (!token) {
        console.log('No token found in cookies');
        return res.status(401).json({ message: 'Not authorized, no token' });
    }
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // select('-password') is used to exclude the password from the user object that is attached to the request object;
        // Assigning to req.user: This effectively attaches the user's data to the req object, making it accessible to subsequent middleware functions or route handlers in the request-response cycle.
        req.user = await User.findById(decoded.userId).select('-password');

        if (!req.user) {
            return res
                .status(401)
                .json({ message: 'Not authorized, user not found' });
        }

        console.log('User authenticated successfully');
        next();
    } catch (error) {
        console.error('Token verification failed:', error);
        throw new Error('Not authorized, token failed');
    }
});

// This middleware function is used to check if the user is an admin
const authorizeAdmin = asyncHandler(async (req, res, next) => {
    // If the user is an admin, then call the next middleware function or route handler function
    if (req.user && req.user.isAdmin) {
        console.log('User is an admin');
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});

export { authenticateUser, authorizeAdmin };
