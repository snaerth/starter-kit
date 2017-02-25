import axios from 'axios';
import {browserHistory} from 'react-router';
import {AUTH_USER, UNAUTH_USER, AUTH_ERROR} from './types';

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
        // Submit email/password Post request to api server Get token from server
        axios
            .post('/api/signin', {email, password})
            .then(response => {
                // Dispatch an actino to authReducer
                dispatch({type: AUTH_USER});
                // Save token to localStorage
                localStorage.setItem('token', response.data.token);
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
    localStorage.removeItem('token');

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

    return {type: AUTH_ERROR, payload: error.response.data};
}