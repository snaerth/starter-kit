import axios from 'axios';
import {browserHistory} from 'react-router';
import {
    AUTH_USER,
    UNAUTH_USER,
    AUTH_ERROR,
    SIGNUP_USER,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    SET_PREVIEW_USER_IMAGE,
    IS_FETCHING,
    CLEAN
} from './types';

/**
 * Is fetching data state
 *
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
export function isFetching() {
    return {type: IS_FETCHING};
}

/**
 * Stores user image for preview
 *
 * @param {Object} image
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
export function setPreviewUserImage(image) {
    return {type: SET_PREVIEW_USER_IMAGE, payload: image};
}

/**
 * Post request made to api with email and passwod
 * Stores token in localStorage if response success and dispatches action AUTH_USER
 * if auth error dispatch error auth
 *
 * @param {Object} email, password
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signinUser({email, password}) {
    return function (dispatch) {
        // Post email/password to api server for sign in Get token back from server
        axios
            .post('/api/signin', {email, password})
            .then(response => {
                const payload = {
                    role: (response.data.role && response.data.role === 'admin')
                        ? response.data.role
                        : '',
                    user: response.data.user
                };
                // Dispatch admin action to authReducer
                dispatch({type: AUTH_USER, payload});
                // Save token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                // Reroute user to home page
                browserHistory.push('/');
            })
            .catch(error => dispatch(authError(AUTH_ERROR, error)));
    };
}

/**
 * Signup Post request
 * Post request to /api/signup to signup user
 * Post request to /api/userimage to save user image
 * Stores token in localStorage if response success and dispatches action AUTH_USER
 * if auth error dispatch error auth
 *
 * @param {Object} email, password, name, image
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signupUser({email, password, name, formData}) {
    return function (dispatch) {
        // Post email/password to api server to register user Get token back from server
        axios
            .post('/api/signup', {email, password, name})
            .then(response => {
                const payload = {
                    role: (response.data.role && response.data.role === 'admin')
                        ? response.data.role
                        : '',
                    user: response.data.user
                };

                // Dispatch admin action to authReducer
                dispatch({type: SIGNUP_USER, payload});
                // Save token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data));

                if (formData) {
                    const config = {
                        headers: {
                            authorization: response.data.token
                        }
                    };
                    // Upload user image
                    return axios.post('/api/userimage', formData, config);
                } else {
                    // Reroute user to home page
                    browserHistory.push('/');
                }
            })
            .then(response => {
                const payload = {
                    role: (response.data.role && response.data.role === 'admin')
                        ? response.data.role
                        : '',
                    user: response.data.user
                };
                // Dispatch admin action to authReducer
                dispatch({type: SIGNUP_USER, payload});
                // Save token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                // Reroute user to home page
                browserHistory.push('/');
            })
            .catch(error => dispatch(authError(AUTH_ERROR, error)));
    };
}

/**
 * Resets image and error for auth
 *
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
export function clean() {
    return {type: CLEAN};
}

/**
 * Signs out user
 * Removes token key from localStorage
 *
 * @returns {Object} action
 * @author Snær Seljan Þóroddsson
 */
export function signoutUser() {
    localStorage.removeItem('user');

    return {type: UNAUTH_USER};
}

/**
 * Forgot password
 *
 * @param {String} email
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function forgotPassword({email}) {
    return function (dispatch) {
        // Post email to api server to retreive new password
        axios
            .post('/api/forgot', {email})
            .then(response => dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: response.data}))
            .catch(error => dispatch(authError(FORGOT_PASSWORD_ERROR, error)));
    };
}

/**
 * Reset password
 *
 * @param {String} password
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function resetPassword({password, token}) {
    return function (dispatch) {
        // Post email to api server to retreive new password
        axios
            .post(`/api/reset/${token}`, {password})
            .then(response => {
                if (!response.data.error) {
                    dispatch({type: RESET_PASSWORD_SUCCESS, payload: response.data.message});
                } else {
                    const error = {
                        response
                    };
                    dispatch(authError(RESET_PASSWORD_ERROR, error));
                }

            })
            .catch(error => dispatch(authError(RESET_PASSWORD_ERROR, error)));
    };
}

/**
 * Handles error from server
 *
 * @returns {Object} action
 * @author Snær Seljan Þóroddsson
 */
export function authError(type, error) {
    const errorMessage = error.response.data.error
        ? error.response.data.error
        : error.response.data;

    let payload = errorMessage;

    if (error.response.status === 401) {
        payload = 'Bad login credentials';
    }

    if (errorMessage && errorMessage.toLowerCase() === 'proxy_error') {
        payload = 'Error connecting to server';
    }

    return {type, payload};
}