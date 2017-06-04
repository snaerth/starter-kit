import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { BrowserRouter as Router } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import routes from './routes';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={store}>
    <Router
      history={history}
      routes={routes}
      onUpdate={window.scrollTo(0, 0)}
    />
  </Provider>,
  document.getElementById('app')
);
