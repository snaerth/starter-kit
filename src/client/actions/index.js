import axios from 'axios';
import {browserHistory} from 'react-router';
import {AUTH_USER, UNAUTH_USER, AUTH_ERROR, SIGNUP_USER, ADMIN_USER} from './types';

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
                if (response.data.role && response.data.role === 'admin') {
                    // Dispatch admin action to authReducer
                    dispatch({type: ADMIN_USER, payload: response.data.role});
                } else {
                    // Dispatch an action to authReducer
                    dispatch({type: AUTH_USER});
                }
                // Save token to localStorage
                localStorage.setItem('user', response.data);
                // Reroute user to home page
                browserHistory.push('/');
            })
            .catch(error => {
                dispatch(authError(error));
            });
    };
}

export function signupUser({email, password, message}) {
    return function (dispatch) {
        // Post email/password to api server to register user Get token back from server
        axios
            .post('/api/signup', {email, password, message})
            .then(response => {
                // Dispatch an actino to authReducer
                dispatch({type: SIGNUP_USER});
                // Save token to localStorage
                localStorage.setItem('user', response.data);
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