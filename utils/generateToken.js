import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
    try {
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET is not defined');
            return;
        }
        // Generate a token with user id and secret using jwt.sign()
        const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
            expiresIn: '30d',
        });

        // used to set a cookie name to a value
        res.cookie('jwt', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            // Restricting the cookie from being sent in cross-site requests, which helps mitigate cross-site request forgery (CSRF) attacks.
            maxAge: 30 * 24 * 60 * 60 * 1000,
        });

        console.log('Token generated successfully');
        return token;
    } catch (error) {
        console.error('Error generating token');
        throw new Error('Error generating token');
    }
};

export default generateToken;
