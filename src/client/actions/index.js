import axios from 'axios';
import {browserHistory} from 'react-router';
import {AUTH_USER, AUTH_ERROR} from './types';

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
    }
}

export function authError(error) {
    return {
        type: AUTH_ERROR,
        payload: error
    }; 
}