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
    USER_UPDATED,
    IS_FETCHING,
    CLEAN
} from './types';

const user = JSON.parse(localStorage.getItem('user'));

const initialState = {
    isFetching: false,
    authenticated: user && user.token
        ? true
        : false,
    user: user || null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case IS_FETCHING:
            return {
                ...state,
                isFetching: true
            };
        case AUTH_USER:
            return {
                ...state,
                authenticated: true,
                isFetching: false,
                user: action.payload.user
            };
        case UNAUTH_USER:
            return {
                ...state,
                user: null,
                isFetching: false,
                authenticated: false,
                image: null
            };
        case USER_UPDATED:
            return {
                ...state,
                authenticated: true,
                isFetching: false,
                user: action.payload
            };
        case SIGNUP_USER:
            return {
                ...state,
                authenticated: true,
                isFetching: false,
                user: action.payload.user
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
        case CLEAN:
            return {
                ...state,
                error: '',
                image: null
            };
    }

    return state;
}