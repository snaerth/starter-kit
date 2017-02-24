import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, browserHistory} from 'react-router';
import routes from './routes.jsx';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

ReactDOM.render(
  <Provider store={store}>
  <Router
    history={browserHistory}
    routes={routes}
    onUpdate={window.scrollTo(0, 0)}/>
</Provider>, document.getElementById('app'));
