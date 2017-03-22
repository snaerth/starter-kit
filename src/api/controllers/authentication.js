import { validateEmail } from '../services/utils';
import sendMail from '../services/mailService';
import { resizeImage } from '../services/imageService';
import { deleteFile } from '../services/fileService';
import User from '../models/user';
import jwt from 'jwt-simple';
import crypto from 'crypto';
import config from '../../config';
import formidable from 'formidable';
import path from 'path';
import uuid from 'uuid/v1';

// VARIABLES
const { PORT, HOST } = config();

/**
 * Sign up route
 * Sign user up to system. If no errors create user
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signup(req, res) {
    if (!req.body) {
        return res
            .status(422)
            .send({ error: 'No post data found' });
    }

    const { email, password, name } = req.body;

    // Validate post request inputs Check for if user exists by email, Save user in
    // database Send response object with user token and user information
    validateSignup({ email, password, name })
        .then(() => checkUserByEmail(email))
        .then(() => saveUser({ email, password, name }))
        .then(data => res.status(200).json(data))
        .catch(error => res.status(422).send({ error }));
}

/**
 * Upload user image to file system
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 * @author Snær Seljan Þóroddsson
 */
export function uploadUserImage(req, res) {
    const { email } = req.user;
    const form = formidable.IncomingForm({
        uploadDir: process.cwd() + '/assets/images/users'
    });

    form.on('error', () => {
        return res
            .status(500)
            .send({ error: 'An error has occured with image upload' });
    });

    form.parse(req, (err, fields, files) => {
        const image = files.image;

        if (image) {
            const ext = path.extname(image.name);
            const fileName = uuid();
            const imgPath = `${form.uploadDir}/${fileName + ext}`;
            const thumbnailPath = `${form.uploadDir}/${fileName + '-thumbnail' + ext}`;
            let updatedUser = {};

            findUserByEmail(email)
                .then(user => {
                    updatedUser = user;
                    updatedUser.imageUrl = fileName + ext;
                    return resizeImage(image.path, imgPath, 400);
                })
                .then(() => resizeImage(image.path, thumbnailPath, 27))
                .then(() => {
                    updatedUser.thumbnailUrl = fileName + '-thumbnail' + ext;
                    return deleteFile(image.path);
                })
                .then(() => updateUser(updatedUser))
                .then(data => res.status(200).json(data))
                .catch(error => res.status(422).send({ error }));
        } else {
            return res
                .status(422)
                .send({ error: 'Image required' });
        }
    });
}

/**
 * Find user by email. If user is found then return user
 *
 * @param {String} email
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function findUserByEmail(email) {
    return new Promise((resolve, reject) => {
        // See if user with given email exists
        User.findOne({
            email
        }, (error, user) => {
            if (error) {
                return reject(error);
            }

            return resolve(user);
        });
    });
}

/**
 * Checks if user exist by email. 
 * If user is found notify that email is in use
 *
 * @param {String} email
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function checkUserByEmail(email) {
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

            return resolve();
        });
    });
}

/**
 * Updates user and save to database
 *
 * @param {Object} props - User properties
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function updateUser(user) {
    return new Promise((resolve, reject) => {
        // Save new user to databases
        user.save((error) => {
            if (error) {
                return reject(error);
            }

            let { name, email, imageUrl, thumbnailUrl ,roles } = user;

            return resolve({ token: tokenForUser(user), user: { name, email, imageUrl, thumbnailUrl, roles } });
        });
    });
}

/**
 * Create new user and save to database
 *
 * @param {Object} fields - Object with props name, email, password, message
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function saveUser({ name, email, password, message, fileName }) {
    return new Promise((resolve, reject) => {
        const newUser = {
            name,
            email,
            password,
            message,
            roles: ['user']
        };

        if (fileName) {
            newUser.imageUrl = fileName;
        }

        // If a user does not exist, create and save new user
        const user = new User(newUser);

        // Save user to databases
        user.save((error) => {
            if (error) {
                return reject(error);
            }

            let { name, email, imageUrl, roles } = user;

            return resolve({ token: tokenForUser(user), user: { name, email, imageUrl, roles } });
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
function validateSignup({ email, password, name }) {
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
    const { name, roles, imageUrl, email } = req.user;


    const data = {
        token: tokenForUser(req.user),
        user: { name, email, imageUrl, roles }
    };

    if (req.user) {
        if (roles.includes('admin')) {
            data.role = 'admin';
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
    const { email } = req.body;

    // Create token Save resetPasswordToken and resetPasswordExpires to user Send
    // email to user
    createRandomToken()
        .then(token => attachTokenToUser({ token, email }))
        .then(({ user, token }) => {
            const url = `${HOST}:${PORT}/reset/${token}`;
            const { email, name } = user;

            return sendResetPasswordEmail({ url, email, name });
        })
        .then(({ email }) => {
            res.send(`An e-mail has been sent to ${email} with further instructions.`);
        })
        .catch((error) => {
            return res
                .status(550)
                .send({ error: `Coundn't reset password at this time.`, err: error });
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
                return reject(error);
            }

            const token = buffer.toString('hex');
            return resolve(token);
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
function attachTokenToUser({ token, email }) {
    return new Promise((resolve, reject) => {
        User.findOne({
            email
        }, (error, user) => {
            if (error) {
                return reject(error);
            }

            user.resetPasswordToken = token;
            user.resetPasswordExpires = Date.now() + (60 * 60 * 1000); // 1 hour

            // Save user to databases
            user.save((error) => {
                if (error) {
                    return reject(error);
                }

                return resolve({ user, token });
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
function sendResetPasswordEmail({ url, email, name }) {
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

        const { to, subject, text, html } = mailOptions;

        sendMail(to, subject, text, html, (error, info) => {
            if (error) {
                return reject(error);
            }

            return resolve({ info, email });
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
        updateUserPassword({ token, password })
            .then(user => res.send(`Success! Your password has been changed for ${user.email}.`))
            .catch(() => res.send({ error: 'Password is invalid or token has expired.' }));
    } else {
        res.send({ error: 'Token and password are required' });
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
function updateUserPassword({ token, password }) {
    return new Promise((resolve, reject) => {
        User.findOne({
            resetPasswordToken: token,
            resetPasswordExpires: {
                $gt: Date.now() - (60 * 60 * 1000)
            }
        }, (error, user) => {
            if (error || !user) {
                return reject({ error: 'Password reset token is invalid or has expired.' });
            }

            user.password = password;
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            // Save user to databases
            user.save((error) => {
                if (error) {
                    return reject(error);
                }

                return resolve(user);
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
        .send({ error: 'Unauthorized' });
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