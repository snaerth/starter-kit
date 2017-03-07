import {validateEmail} from '../services/utils';
import sendMail from '../services/mailService';
import {saveImage, isImage} from '../services/imageService';
import User from '../models/user';
import jwt from 'jwt-simple';
import crypto from 'crypto';
import config from '../../config';

// VARIABLES
const {PORT, HOST} = config();

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
export function signup(req, res) {
    if (!req.body) {
        return res
            .status(422)
            .send({error: 'No post data found'});
    }

    const {email, password, message, name} = req.body;
    const file = req.file;

    // Check for image file in request
    if (file) {
        isImage(file)
        .then(() => saveImage(file.path, './assets/images/users'))
        .then(() => validateSignup({email, password, name}))
        .then(() => findUserByEmailAndSave({name, email, password, message}))
        .then(data => res.json(data))
        .catch(error => res.status(422).send({error}));
    } else {
        validateSignup({email, password, name})
        .then(() => findUserByEmailAndSave({name, email, password, message}))
        .then(data => res.json(data))
        .catch(error => res.status(422).send({error}));
    }

}

/**
 * Find user by email. If user is found then save user to db
 * else reject promise with error
 *
 * @param {Object} fields - Object with props name, email, password, message
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function findUserByEmailAndSave({name, email, password, message}) {
    return new Promise((resolve, reject) => {
        // See if user with given email exists
        User.findOne({
            email
        }, (error, existingUser) => {
            if (error) {
                return reject(error);
            }

            // If a user does exist, return error
            if (existingUser) {
                return reject('Email is in use');
            }

            // If a user does not exist, create and save new user
            const user = new User({name, email, password, message, roles: ['user']});

            // Save user to databases
            user.save((error) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    token: tokenForUser(user),
                    user
                });
            });
        });
    });
}

/**
 * Validates email, password and name from post request
 * If error then send response with error and status 422
 *
 * @param {String} email
 * @param {String} password
 * @param {String} name
 * @param {Object} res
 * @returns {Object} res
 * @author Snær Seljan Þóroddsson
 */
function validateSignup({email, password, name}) {
    return new Promise((resolve, reject) => {
        // Check if email, password or message exist in request
        if (!email || !password || !name) {
            return reject('You must provide name, email and password');
        } 
        // Validate email
        if (!validateEmail(email)) { 
            return reject(`${email} is not a valid email`);
        } 
        // Check if password length is longer then 6 characters
        if (password.length < 6) { 
            return reject('Password must be of minimum length 6 characters');
        } 
        // Check if password contains one number and one uppercase letter
        if (!/[0-9]/.test(password) || !/[A-Z]/.test(password)) { 
            return reject('Password must contain at least one number (0-9) and one uppercase letter (A-Z)');
        } 

        // Name has to have aleast two names
        if (!/^([^0-9]*)$/.test(name) || name.trim().split(' ').length < 2) {
            return reject('Name has aleast two 2 names consisting of letters');
        }

        return resolve();
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
 * Forgot password route
 * TODO describe info
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function forgotPassword(req, res) {
    const {email} = req.body;

    // Create token Save resetPasswordToken and resetPasswordExpires to user Send
    // email to user
    createRandomToken()
        .then(token => attachTokenToUser({token, email}))
        .then(({user, token}) => {
            const url = `${HOST}:${PORT}/reset/${token}`;
            const {email, name} = user;

            return sendResetPasswordEmail({url, email, name});
        })
        .then(({email}) => {
            res.send(`An e-mail has been sent to ${email} with further instructions.`);
        })
        .catch((error) => {
            return res
                .status(550)
                .send({error: `Coundn't reset password at this time.`, err: error});
        });
}

/**
 * Generates uniq token
 *
 * @returns {Promise} promise - TOken
 * @author Snær Seljan Þóroddsson
 */
function createRandomToken() {
    return new Promise((resolve, reject) => {
        crypto.randomBytes(20, (error, buffer) => {
            if (error) {
                reject(error);
            }

            const token = buffer.toString('hex');
            resolve(token);
        });
    });
}

/**
 * Finds user by email,if user exist
 * set resetPasswordToken and resetPasswordExpires props
 * save those props to user
 *
 * @returns {Promise} promise - User
 * @author Snær Seljan Þóroddsson
 */
function attachTokenToUser({token, email}) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email
        }, (error, user) => {
            if (error) {
                reject(error);
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + (60 * 60 * 1000); // 1 hour

            // Save user to databases
            user.save((error) => {
                if (error) {
                    reject(error);
                }

                resolve({user, token});
            });
        });
    });
}

/**
 * Send reset password email
 *
 * @returns {Promise} promise - User
 * @author Snær Seljan Þóroddsson
 */
function sendResetPasswordEmail({url, email, name}) {
    return new Promise((resolve, reject) => {
        const mailOptions = {
            to: email,
            subject: 'Password reset',
            text: 'Password reset',
            html: `
                    <p>Hi ${name}</p>
                    <p>We've received a request to reset your password. If you didn't make the request</p>
                    <p>just ignore this email. Otherwise you can reset your password using this link:</p>
                    <a href="http://${url}">Click here to reset your password</a>
                    <p>Thank you.</p>
                `
        };

        const {to, subject, text, html} = mailOptions;

        sendMail(to, subject, text, html, (error, info) => {
            if (error) {
                reject(error);
            }

            resolve({info, email});
        });
    });
}

/**
 * Resets user password
 * Finds user by resetPasswordToken property and resetPasswordExpires
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function resetPassword(req, res) {
    const token = req.params.token;
    const password = req.body.password;

    if (token && password) {
        updateUserPassword({token, password})
            .then(user => res.send({message: `Success! Your password has been changed for ${user.email}.`}))
            .catch(() => res.send({error: 'Password reset token is invalid or has expired.'}));
    } else {
        res.send({error: 'Token and password are required'});
    }
}

/**
 * Finds user, updates properties (password, resetPasswordToken, resetPasswordExpires)
 * and saves user with new propertys
 *
 * @param {String} token
 * @param {String} password
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
function updateUserPassword({token, password}) {
    return new Promise((resolve, reject) => {
        User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $lt: Date.now() - (60 * 60 * 1000)
            }
        }, (error, user) => {
            if (error || !user) {
                reject({error: 'Password reset token is invalid or has expired.'});
            }

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save user to databases
            user.save((error) => {
                if (error) {
                    reject(error);
                }

                resolve(user);
            });
        });
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