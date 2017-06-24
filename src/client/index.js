/* eslint no-underscore-dangle: [2, { "allow": ["window", "__PRELOADED_STATE__"] }] */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import App from './components';
import routes from './routes';

const preloadedState = window.__PRELOADED_STATE__;

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();
const store = configureStore(preloadedState, history);

ReactDOM.render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <App>{routes}</App>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('app'),
);
