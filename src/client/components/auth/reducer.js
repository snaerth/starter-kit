import {
    AUTH_USER,
    UNAUTH_USER,
    SIGNUP_USER,
    AUTH_ERROR,
    FORGOT_PASSWORD_SUCCESS,
    FORGOT_PASSWORD_ERROR,
    RESET_PASSWORD_SUCCESS,
    RESET_PASSWORD_ERROR,
    SET_PREVIEW_USER_IMAGE,
    IS_FETCHING,
    RESET_SIGNUP_STATE
} from './types';

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
        case IS_FETCHING:
            return {
                ...state,
                isFetching: true
            }
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
        case RESET_SIGNUP_STATE:
            return {
                ...state,
                error: '',
                image: null
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
        case RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                isFetching: false,
                message: action.payload
            };
        case RESET_PASSWORD_ERROR:
            return {
                ...state,
                isFetching: false,
                error: action.payload
            };
        case SET_PREVIEW_USER_IMAGE:
            return {
                ...state,
                image: action.payload
            };
    }

    return state;
}