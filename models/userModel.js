import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, required: true, default: false },
    // An array of friends, where each friend is a reference to the User model
    friends: [
        { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: [] },
    ],
    // An array of accounts one follows, so we can display them in a taable
    following: { type: Array, default: [] },
    summonerDetails: {
        summonerName: { type: String },
        tag: { type: String },
        region: { type: String },
        default: {},
    },
});

const User = mongoose.model('User', userSchema);

export default User;
