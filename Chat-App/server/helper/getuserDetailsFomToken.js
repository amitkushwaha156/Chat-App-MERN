const jwt = require('jsonwebtoken');
const userModel = require('../models/UserModel');

const getUserDetailsFomToken = async (token) => {
    try {
        // Check if token is provided
        if (!token) {
            return {
                message: 'Session out, no token provided',
                logout: true,
            };
        }

        // Verify the token and decode the payload
        const decoded = await jwt.verify(token, process.env.JWT_SECRET_KEY);

        // Fetch the user details from the database using the decoded token's id
        const user = await userModel.findById(decoded.id).select('-password');
        
        // If user not found in the database
        if (!user) {
            return {
                message: 'User not found',
                logout: true,
            };
        }

        // Return the user details
        return user;

    } catch (err) {
        // Handle specific JWT errors
        if (err.name === 'TokenExpiredError') {
            return {
                message: 'Token has expired',
                logout: true,
            };
        } else if (err.name === 'JsonWebTokenError') {
            return {
                message: 'Invalid token',
                logout: true,
            };
        } else {
            // General error handling
            return {
                message: 'Token verification failed',
                error: err.message,
                logout: true,
            };
        }
    }
};

module.exports = getUserDetailsFomToken;
