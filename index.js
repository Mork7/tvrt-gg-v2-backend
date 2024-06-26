// Packages
import express from 'express';
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });
import cookieParser from 'cookie-parser';
import cors from 'cors';

// Utils
import connectDB from './config/connectDB.js';
import userRoutes from './routes/userRoutes.js';

const port = process.env.PORT || 5000;
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

const corsOrigin =
    process.env.NODE_ENV === 'development'
        ? 'http://localhost:5173'
        : ['https://tvrtgaming.com', 'https://www.tvrtgaming.com'];

const corsOptions = {
    origin: corsOrigin,
    credentials: true, // Allow credentials (cookies)
};

app.use(cors(corsOptions));

app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
});

// User Routes
app.use('/users', userRoutes);
