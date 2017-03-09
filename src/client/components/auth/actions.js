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
    SET_PREVIEW_USER_IMAGE} from './types';

/**
 * Stores user image for preview
 *
 * @param {Object} image
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
export function setPreviewUserImage(image) {
    return {
        type: SET_PREVIEW_USER_IMAGE,
        payload: image
    };
}


/**
 * Post request made to api with email and passwod
 * Stores token in localStorage if response success and dispatches action AUTH_USER
 * if auth error dispatch erro auth
 *
 * @param {String} email
 * @param {String} password
 * @returns {undefined}
 * @author Snær Seljan Þóroddsson
 */
export function signinUser({email, password}) {
    return function (dispatch) {
        // Post email/password to api server for sign in Get token back from server
        axios
            .post('/api/signin', {email, password})
            .then(response => {
                const payload = (response.data.role && response.data.role === 'admin') ? response.data.role : '';
                // Dispatch admin action to authReducer
                dispatch({type: AUTH_USER, payload});
                // Save token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                // Reroute user to home page
                browserHistory.push('/');
            })
            .catch(error => {
                dispatch(authError(error));
            });
    };
}

export function signupUser({email, password, name}) {
    return function (dispatch) {
        // Post email/password to api server to register user Get token back from server
        axios
            .post('/api/signup', {email, password, name})
            .then(response => {
                const payload = (response.data.role && response.data.role === 'admin') ? response.data.role : '';
                // Dispatch admin action to authReducer
                dispatch({type: SIGNUP_USER, payload});
                // Save token to localStorage
                localStorage.setItem('user', JSON.stringify(response.data));
                // Reroute user to home page
                browserHistory.push('/');
            })
            .catch(error => {
                dispatch(authError(error));
            });
    };
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
            .then(response => {
                // Dispatch admin action to authReducer
                dispatch({type: FORGOT_PASSWORD_SUCCESS, payload: response.data});
            })
            .catch(error => {
                dispatch({type: FORGOT_PASSWORD_ERROR, payload: error});
            });
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
                // Dispatch admin action to authReducer
                dispatch({type: RESET_PASSWORD_SUCCESS, payload: response.data});
            })
            .catch(error => {
                dispatch({type: RESET_PASSWORD_ERROR, payload: error});
            });
    };
}


/**
 * Handles error from server
 *
 * @returns {Object} action
 * @author Snær Seljan Þóroddsson
 */
export function authError(error) {
    if (error.response.status === 401) {
        return {type: AUTH_ERROR, payload: 'Bad login credentials'};
    }

    return {type: AUTH_ERROR, payload: error.response.data.error};
}