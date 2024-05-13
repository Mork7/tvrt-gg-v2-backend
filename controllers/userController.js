import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

const createUser = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        name,
        email,
        password: hashedPassword,
    });

    try {
        await newUser.save();

        // generateToken will take the user id and generate a token and set-cookie for the user
        generateToken(res, newUser._id);

        return res.status(201).json({
            _id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            isAdmin: newUser.isAdmin,
        });
    } catch (error) {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

const loginUser = asyncHandler(async (req, res) => {
    // Destructure email and password from req.body
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
        res.status(400);
        throw new Error('Please fill all fields');
    }

    // Find user by email
    const user = await User.findOne({ email });

    // Check if user exists
    if (!user) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // Check if password matches
    const isMatch = await bcrypt.compare(password, user.password);

    // If password does not match, throw an error
    if (!isMatch) {
        res.status(401);
        throw new Error('Invalid email or password');
    }

    // generateToken will take the user id and generate a token and set-cookie for the user
    generateToken(res, user._id);

    // Return user data
    return res.status(200).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
    });
});

const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if(!req.cookies.jwt) {
            res.status(400);
            throw new Error('No user logged in');
        }
        // Clear cookie
        res.clearCookie('jwt');
        // Return success message
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // If error, return error message and throw error
        res.status(400);
        throw new Error('No user logged in');
    }
});

const getAllUsers = asyncHandler(async (req, res) => {
    // Find all users using mongoose find method and return them
    const users = await User.find({});
    return res.status(200).json(users);

});

const getCurrentUserProfile = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id);

    if(user) {
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }

});    


 
export { createUser, loginUser, logoutUser, getAllUsers, getCurrentUserProfile };