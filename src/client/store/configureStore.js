import { createStore, compose } from 'redux';
import rootReducer from '../reducers';
import { reducer as form } from 'redux-form';

export default function configureStore(initialState) {
  return createStore(
    rootReducer,
    form,
    initialState,
    compose((typeof window === 'object' && typeof window.devToolsExtension !== 'undefined') ? window.devToolsExtension() : f => f)
  );
}