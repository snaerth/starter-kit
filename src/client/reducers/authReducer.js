import { AUTH_USER, UNAUTH_USER, SIGNUP_USER, AUTH_ERROR, ADMIN_USER } from '../actions/types';

export default function (state = {}, action) {
    switch (action.type) {
        case AUTH_USER:
            return {
                ...state,
                authenticated: true
            };
        case ADMIN_USER:
            return {
                ...state,
                authenticated: true,
                role: action.payload
            };            
        case UNAUTH_USER:
            return {
                ...state,
                authenticated: false
            };
        case SIGNUP_USER:
            return {
                ...state,
                authenticated: true
            };
        case AUTH_ERROR:
            return {
                ...state,
                error: action.payload
            };
    }

    return state;
}