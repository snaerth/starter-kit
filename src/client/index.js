import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { BrowserRouter as Router } from 'react-router-dom';
import { syncHistoryWithStore } from 'react-router-redux';
import { createBrowserHistory } from 'history';
import App from './components';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);
// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(createBrowserHistory(), store);

ReactDOM.render(
  <Provider store={store}>
    <Router history={history}><App /></Router>
  </Provider>,
  document.getElementById('app')
);

const rootEl = document.getElementById('app');
const renderApp = Component => {
  ReactDOM.render(
    <Provider store={store}>
      <Router history={history}><Component /></Router>
    </Provider>,
    rootEl
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./components', () => {
    const nextApp = require('./components');
    renderApp(nextApp);
  });
}
