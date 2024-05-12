import jwt from 'jsonwebtoken';
import User from '../models/userModel.js';
import asyncHandler from './asyncHandler.js';

const authenictateUser = asyncHandler(async (req, res, next) => {
    let token = req.cookie.jwt;
});
