import {
  combineReducers
} from 'redux';
import {
  reducer as form
} from 'redux-form';
import authReducer from './components/auth/reducer';
import commonReducer from './common/reducer';
import {
  routerReducer
} from 'react-router-redux'

const rootReducer = combineReducers({
  common: commonReducer,
  form,
  auth: authReducer,
  routing: routerReducer
});

export default rootReducer;