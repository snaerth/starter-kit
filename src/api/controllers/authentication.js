import {validateEmail} from '../services/utils';
import User from '../models/user';
import jwt from 'jwt-simple';

/**
 * Sign up route
 * Sign user up to system. If no errors create user
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Func} next
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signup(req, res, next) {
    if (!req.body) {
        return res
            .status(422)
            .send({error: 'No post data found'});
    }

    const {email, password, message} = req.body;

    // Check if email, password or message exist in request
    if (!email || !password || !message) {
        return res
            .status(422)
            .send({error: 'You must provide email, password and message'});
    }

    // Validate email
    if (!validateEmail(email)) {
        return res
            .status(422)
            .send({error: `${email} is not a valid email`});
    }

    // Check if password length is longer then 6 characters
    if (password.length < 6) {
        return res
            .status(422)
            .send({error: 'Password must be of minimum length 6 characters'});
    }

    // Check if password contains one number and one uppercase letter
    if (!/[0-9]/.test(password) || !/[A-Z]/.test(password)) {
        return res
            .status(422)
            .send({error: 'Password must contain at least one number (0-9) and one uppercase letter (A-Z)'});
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
                .send({error: 'Email is in use'});
        }

        // If a user does not exist, create and save new user
        const user = new User({email: email, password: password, message: message, roles: ['user']});

        // Save user to databases
        user.save((error) => {
            if (error) {
                return next(error);
            }

            // Respond to request that user was created
            res.json({token: tokenForUser(user)});
        });

    });
}

/**
 * Signin route
 * If users is authenticated responde with a token
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signin(req, res) {
    const {name, roles} = req.user;

    const data = {
        token: tokenForUser(req.user)
    };

    if (req.user) {
        if (roles.includes('admin')) {
            data.role = 'admin';
        }
        if (name !== '') {
            data.name = name;
        }
    }

    res.send(data);
}

/**
 * Signin admin route
 * If users is authenticated responde with a token and role
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signinAdmin(req, res) {
    res.send({
        token: tokenForUser(req.user),
        role: 'admin'
    });
}

/**
 * Check whether user has admin roles
 *
 * @param {Object} req
 * @param {Object} res
 * @param {Func} next
 * @returns {undefined
 * @author Snær Seljan Þóroddsson
 */
export function isAdmin(req, res, next) {
    if (req.user && req.user.roles.includes('admin')) {
        return next();
    }

    return res
        .status(401)
        .send({error: 'Unauthorized'});
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