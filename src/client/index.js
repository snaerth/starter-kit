/* eslint no-underscore-dangle: [2, { "allow": ["window", "__PRELOADED_STATE__"] }] */
import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from './store/configureStore';
import App from './components';
import routes from './routes';
import ReactHotLoader from './containers/reactHotLoader';
import rootReducer from './reducers';

const preloadedState = window.__PRELOADED_STATE__;

// Create an enhanced history that syncs navigation events with the store
const history = createHistory();
const store = configureStore(preloadedState, history);

const renderApp = (Root, target = 'app') => {
  ReactDOM.render(
    <ReactHotLoader>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <Root>{routes}</Root>
        </ConnectedRouter>
      </Provider>
    </ReactHotLoader>,
    document.getElementById(target),
  );
};

renderApp(App);

if (module.hot) {
  module.hot.accept('./reducers', () => {
    // redux store has a method replaceReducer
    store.replaceReducer(rootReducer);
  });

  module.hot.accept('./components', () => {
    const nextApp = require('./components');
    renderApp(nextApp);
  });
}
