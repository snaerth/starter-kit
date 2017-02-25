import {combineReducers} from 'redux';
import {reducer as form} from 'redux-form';
import {authReducer as auth} from './authReducer';

const rootReducer = combineReducers({form, auth});

export default rootReducer;
