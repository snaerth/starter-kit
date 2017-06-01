import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, browserHistory} from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux'
import match from 'react-router/lib/match';
import routes from './routes';

const preloadedState = window.__PRELOADED_STATE__;
const store = configureStore(preloadedState);

// Create an enhanced history that syncs navigation events with the store
const history = syncHistoryWithStore(browserHistory, store);

// Render the application
const render = (Root, target = 'app') => {
  match({
    routes: (
      <Router>{routes}</Router>
    ),
    location: window.location
  }, (err, location, props) => {

    // Make sure that all System.imports are loaded before rendering
    const imports = props
      .routes
      .filter(route => route.getComponent)
      .map(route => new Promise(resolve => route.getComponent(location, resolve)));

    // Run the chain
    Promise
      .all(imports)
      .then(() => {
        ReactDOM.render(
          <Root store={store}>
          <Router
            history={history}
            routes={routes}
            onUpdate={window.scrollTo(0, 0)}/>
        </Root>, document.getElementById(target));
      });
  });
};

// Render for the first time
render(Provider);
