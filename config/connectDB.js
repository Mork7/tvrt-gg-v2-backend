import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        if (process.env.NODE_ENV !== 'production') {
            await mongoose.connect(`${process.env.MONGO_DEVELOPMENT_URI}`);
        } else {
            await mongoose.connect(`${process.env.MONGO_PRODUCTION_URI}`);
        }
        console.log('MongoDB Connected 😄');
    } catch (error) {
        console.log('MongoDB Connection Failed 😞', error);
        process.exit(1);
    }
};

export default connectDB;
