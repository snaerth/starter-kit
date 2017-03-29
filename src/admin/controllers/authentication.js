import { validateEmail } from '../services/utils';
import sendMail from '../services/mailService';
import { resizeImage } from '../services/imageService';
import { checkFileAndDelete } from '../services/fileService';
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
    if (!req.body)
        return res.status(422).send({ error: 'No post data found' });

    const { email, password, name } = req.body;

    // Validate post request inputs Check for if user exists by email, Save user in
    // database Send response object with user token and user information
    validateSignup({ email, password, name })
        .then(() => checkUserByEmail(email))
        .then(() => {
            const user = new User({ name, email, password });
            return saveUser(user);
        })
        .then(data => res.status(200).json(data))
        .catch(error => res.status(422).send({ error }));
}

/**
 * Updates user and save to database
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 * @author Snær Seljan Þóroddsson
 */
export function updateUser(req, res) {
    if (!req.body)
        return res.status(422).send({ error: 'No post data found' });
    if (!req.user)
        return res.status(422).send({ error: 'No user found' });

    const {
        user,
        email,
        password,
        newPassword,
        name,
        dateOfBirth,
        phone
    } = req.body;

    validateSignup({ email, password, newPassword, name, dateOfBirth }).then(() => findUserByEmail(email)).then(user => {
        user.email = email;
        user.password = password;
        user.name = name;
        user.dateOfBirth = dateOfBirth;
        user.phone = phone;
        user.comparePassword(password, (error, isMatch) => {
            if (error) {
                return Promise.reject({ error });
            }

            if (!isMatch) {
                return Promise.reject({ error: 'Password does not match old password' });
            }

            return Promise.resolve();
        });
    }).then(() => {
        user.password = newPassword;
        // Save new user to databases
        return saveUser(user);
    })
        .then(data => res.status(200).json(data))
        .catch(error => res.status(422).send({ error }));
}

/**
 * Upload user image to file system
 *
 * @param {Object} req
 * @param {Object} res
 * @returns {Object} res
 * @author Snær Seljan Þóroddsson */
export function uploadUserImage(req, res) {
    const { email } = req.user;
    const form = formidable.IncomingForm({ uploadDir: './assets/images/users/' });

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
            const imgPath = form.uploadDir + fileName + ext;
            const thumbnailPath = form.uploadDir + `${fileName + '-thumbnail' + ext}`;
            let updatedUser = {};

            findUserByEmail(email).then(user => {
                updatedUser = user;
                let promises = [];
                const { imageUrl, thumbnailUrl } = user;

                if (imageUrl) {
                    promises.push(checkFileAndDelete(form.uploadDir + imageUrl));
                }

                if (thumbnailUrl) {
                    promises.push(checkFileAndDelete(form.uploadDir + thumbnailUrl));
                }

                return Promise.all([promises]);
            }).then(() => {
                updatedUser.imageUrl = fileName + ext;
                return resizeImage(image.path, imgPath, 400);
            }).then(() => resizeImage(image.path, thumbnailPath, 27)).then(() => {
                updatedUser.thumbnailUrl = fileName + '-thumbnail' + ext;
                return checkFileAndDelete(image.path);
            }).then(() => saveUser(updatedUser, ['password']))
                .then(data => res.status(200).send(data))
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
        }, (error, user) => {
            if (error) {
                return reject(error);
            }

            // If a user does exist, return error
            if (user) {
                return reject('Email is in use');
            }

            return resolve();
        });
    });
}

/**
 * Create new user and save to database
 *
 * @param {Object} user - Mongoose user schema object
 * @param {Object} propsToDelArr - Array of properites to delete
 * @returns {Promise}
 * @author Snær Seljan Þóroddsson
 */
function saveUser(user, propsToDelArr) {
    return new Promise((resolve, reject) => {
        if (user.constructor.name === 'model') {
            // Save user to databases
            user.save((error) => {
                if (error) {
                    return reject(error);
                }

                let newUser = removeUserProps(user, propsToDelArr);

                return resolve({
                    token: tokenForUser(user),
                    ...newUser
                });
            });
        } else {
            return reject('Object is not a mongoose object');
        }
    });
}

/**
 * Validates email, password and name from post request
 * If error then send response with error and status 422
 *
 * @param {String} email
 * @param {String} password
 * @param {String} newPassword
 * @param {String} name
 * @param {String} dateOfBirth
 * @param {Object} res
 * @returns {Object} res
 * @author Snær Seljan Þóroddsson
 */
function validateSignup({ email, password, newPassword, name, dateOfBirth }) {
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

        if (newPassword) {
            // Check if password length is longer then 6 characters
            if (newPassword.length < 6) {
                return reject('New password must be of minimum length 6 characters');
            }
            // Check if password contains one number and one uppercase letter
            if (!/[0-9]/.test(newPassword) || !/[A-Z]/.test(newPassword)) {
                return reject('New password must contain at least one number (0-9) and one uppercase letter (A-' +
                    'Z)');
            }
        }

        // Name has to have aleast two names
        if (!/^([^0-9]*)$/.test(name) || name.trim().split(' ').length < 2) {
            return reject('Name has aleast two 2 names consisting of letters');
        }

        if (dateOfBirth && !Date.parse(dateOfBirth)) {
            return reject('Date is not in valid format. Try DD.MM.YYYY');
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
    let user = req.user;
    let data = null;

    if (user) {
        const userObject = removeUserProps(user, ['password']);

        data = {
            token: tokenForUser(user),
            ...userObject
        };

        if (user.roles.includes('admin')) {
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
            return saveUser(user);
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
 * Removes properties from mongoose user schema object
 * 
 * @param {Object} user - Mongoose user schema object
 * @param {Array} moreProps - Array of strings to remove from user object
 * @returns {Object} newUser
 */
export function removeUserProps(user, moreProps) {
    let delProps = ['__v', '_id', 'createdAt'];
    delProps = delProps.concat(moreProps);
    let newUser = user.toObject();

    for (let i = 0; i < delProps.length; i++) {
        if (newUser.hasOwnProperty(delProps[i])) {
            delete newUser[delProps[i]];
        }
    }

    return newUser;
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
export function tokenForUser(user) {
    const timestamp = new Date().getTime();
    return jwt.encode({
        sub: user.id,
        iat: timestamp
    }, process.env.JWT_SECRET);
}