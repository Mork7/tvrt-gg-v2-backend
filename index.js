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

const corsOptions = {
    origin: process.env.FRONTEND_URI,
    credentials: true, // Allow credentials (cookies)
};
app.use(cors(corsOptions));


app.get('/', (req, res) => {
    res.send('API is running...');
});

app.use(express.urlencoded({ extended: true }));

console.log('Environment Variables:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('PORT:', process.env.PORT);
console.log('MONGO_PRODUCTION_URI:', process.env.MONGO_PRODUCTION_URI);
console.log('FRONTEND_URI:', process.env.FRONTEND_URI);

app.listen(port, () => {
    console.log(`Server is running on port ${port} 🚀`);
});

// User Routes
app.use('/users', userRoutes);
