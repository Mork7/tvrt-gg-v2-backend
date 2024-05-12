import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenictateUser = asyncHandler(async (req, res, next) => {
    // read the token from the cookie
    let token = req.cookie.jwt;

    // if the token exists in the cookie then verify the token and extract the userId from it and attach it to the request object as req.user so that it can be accessed in the next middleware function or route handler function that uses this middleware function
    if (token) {
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            // select('-password') is used to exclude the password from the user object that is attached to the request object;
            req.user = await User.findById(decoded.userId).select('-password');
            console.log('User authenticated successfully');
            next();
        } catch (error) {
            res.status(401);
            throw new Error('Not authorized, token failed');
        }
    } else {
        res.status(401);
        throw new Error('Not authorized, no token');
    }
});

const authorizeAdmin = asyncHandler(async (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
});

export { authenictateUser, authorizeAdmin };