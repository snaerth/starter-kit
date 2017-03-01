import { validateEmail } from '../services/utils';
import User from '../models/user';
import jwt from 'jwt-simple';

// SIGNUP
export function signup(req, res, next) {
    if (!req.body) {
        return res
            .status(422)
            .send({ error: 'No post data found' });
    }

    const {email, password, message} = req.body;

    if (!email || !password || !message) {
        return res
            .status(422)
            .send({ error: 'You must provide email, password and message' });
    }

    // Validate email
    if (!validateEmail(email)) {
        return res
            .status(422)
            .send({ error: `${email} is not a valid email` });
    }

    // Check if password length is longer then 6 characters
    if (password.length < 6) {
        return res
            .status(422)
            .send({ error: 'Password must be of minimum length 6 characters' });
    }

    if (!/[0-9]/.test(password) || !/[A-Z]/.test(password)) {
        return res
            .status(422)
            .send({ error: 'Password must contain at least one number (0-9) and one uppercase letter (A-Z)' });
    }

    // See if user with given email exists
    User.findOne({
        email
    }, (error, existingUser) => {
        if (error)
            return next(error);

        // If a user does exist, return error
        if (existingUser) {
            return res
                .status(422)
                .send({ error: 'Email is in use' });
        }

        // If a user does not exist, create and save new user
        const user = new User({ email: email, password: password, message: message, roles: ['user'] });

        user.save((error) => {
            if (error) {
                return next(error);
            }

            // Respond to request that user was created
            res.json({ token: tokenForUser(user) });
        });

    });
}

// SIGNIN
export function signin(req, res) {
    res.send({
        token: tokenForUser(req.user)
    });
}

/**
 * Gets token for user
 * @param {Object} user - User object
 * @returns {String} token - Newly created token
 */
function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, process.env.JWT_SECRET);
}