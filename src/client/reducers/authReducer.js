import {
    AUTH_USER,
    UNAUTH_USER,
    SIGNUP_USER,
    AUTH_ERROR,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR
} from '../actions/types';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    isFetching: false,
    authenticated: user && user.token
        ? true
        : false,
    role: user && user.role
        ? user.role
        : 'user'
};

export default function (state = initialState, action) {
    switch (action.type) {
        case AUTH_USER:
            return {
                ...state,
                authenticated: true,
                isFetching: false,
                role: action.payload
            };
        case UNAUTH_USER:
            return {
                ...state,
                isFetching: false,
                authenticated: false
            };
        case SIGNUP_USER:
            return {
                ...state,
                authenticated: true,
                isFetching: false,
                role: action.payload
            };
        case AUTH_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload
            };
        case FORGOT_PASSWORD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                message: action.payload
            };
        case FORGOT_PASSWORD_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload
            };
    }

    return state;
}