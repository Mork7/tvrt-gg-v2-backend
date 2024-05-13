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

export { createUser };
