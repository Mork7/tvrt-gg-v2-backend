import User from '../models/userModel.js';
import asyncHandler from '../middleware/asyncHandler.js';
import generateToken from '../utils/generateToken.js';
import bcrypt from 'bcryptjs';

// ✅
const createUser = asyncHandler(async (req, res) => {
    const { name, email, password, summonerDetails } = req.body;

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
        summonerDetails,
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
            summonerDetails: newUser.summonerDetails,
        });
    } catch (error) {
        res.status(400);
        throw new Error('Invalid user data');
    }
});

// ✅
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
        following: user.following,
        friends: user.friends,
        summonerDetails: user.summonerDetails,
    });
});

// ✅
const logoutUser = asyncHandler(async (req, res) => {
    try {
        // Check if user is logged in
        if (!req.cookies.jwt) {
            res.status(400);
            throw new Error('No user logged in');
        }
        // Clear cookie
        res.clearCookie('jwt', {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'Strict', // Or 'Lax' depending on your requirement
        });
        // Return success message
        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        // If error, return error message and throw error
        res.status(400);
        throw new Error('No user logged in');
    }
});

// ✅
const getCurrentUserProfile = asyncHandler(async (req, res) => {
    // Find user by id
    const user = await User.findById(req.user._id);

    // If user exists, return user data
    if (user) {
        return res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            following: user.following,
            friends: user.friends,
            summonerDetails: user.summonerDetails,
        });
    } else {
        // If user does not exist, throw an error
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅
const getCurrentUserFollowing = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        return res.status(200).json(user.following);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅
const updateCurrentProfile = asyncHandler(async (req, res) => {
    // Find user by id
    const user = await User.findById(req.user._id);

    // If user exists, update user data
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.summonerDetails = req.body.summonerDetails || user.summonerDetails;

        // If password is provided, hash the password and update the user password
        if (req.body.password) {
            user.password = await bcrypt.hash(req.body.password, 10);
        }

        // Save updated user data
        const updatedUser = await user.save();

        // Return updated user data
        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            summonerDetails: updatedUser.summonerDetails,
        });
    } else {
        // If user does not exist, throw an error
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅
const addSummonerToFollowing = asyncHandler(async (req, res) => {
    // Find user in the database by id
    const user = await User.findById(req.user._id);

    if (user) {
        const { summonerName, tag, region } = req.body;

        // Check if the summoner already exists in the following list
        const alreadyFollowing = user.following.some(
            (summoner) =>
                summoner.summonerName === summonerName &&
                summoner.tag === tag &&
                summoner.region === region
        );

        // If the summoner already exists in the following list, return an error
        if (alreadyFollowing) {
            res.status(400).json({
                message: 'User is already following this summoner',
            });
        } else {
            // If the summoner does not exist in the following list, add the summoner to the following list
            user.following.push({ summonerName, tag, region });
            await user.save();
            res.status(200).json(user.following);
        }
    } else {
        res.status(404);
        throw new Error('Summoner not found');
    }
});

// ✅
const removeSummonerFromFollowing = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        const { summonerName, tag } = req.body;

        // remove user from following list
        user.following = user.following.filter(
            (summoner) => summoner.summonerName !== summonerName || summoner.tag !== tag
        );

        await user.save();
        res.status(200).json(user.following);
    } else {
        res.status(404);
        throw new Error('Summoner not found');
    }
});

// ADMIN STUFF
// :id
const deleteUser = asyncHandler(async (req, res) => {
    // Find user by id
    const user = await User.findById(req.params.id);

    // If user exists, delete user
    if (user) {
        if (user.isAdmin) {
            throw new Error('Admin user cannot be deleted');
        }
        await user.deleteOne(user._id);
        return res.status(200).json({ message: 'User removed' });
    } else {
        // If user does not exist, throw an error
        res.status(404);
        throw new Error('User not found');
    }
});

// :id
const getUserById = asyncHandler(async (req, res) => {
    // Find user by id and exclude password from user data
    const user = await User.findById(req.params.id).select('-password');

    // If user exists, return user data
    if (user) {
        return res.status(200).json(user);
    } else {
        // If user does not exist, throw an error
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅
const updateUserById = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id).select('-password');

    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.isAdmin = Boolean(req.body.isAdmin);

        const updatedUser = await user.save();

        return res.status(200).json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            summonerDetails: updatedUser.summonerDetails,
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// ✅
const getAllUsers = asyncHandler(async (req, res) => {
    // Find all users using mongoose find method and return them
    const users = await User.find({});
    return res.status(200).json(users);
});

export {
    createUser,
    loginUser,
    logoutUser,
    getAllUsers,
    getCurrentUserProfile,
    updateCurrentProfile,
    deleteUser,
    getUserById,
    updateUserById,
    getCurrentUserFollowing,
    addSummonerToFollowing,
    removeSummonerFromFollowing,
};
