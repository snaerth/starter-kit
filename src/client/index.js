import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store/configureStore';
import { ConnectedRouter } from 'react-router-redux';
import createHistory from 'history/createBrowserHistory';
import App from './components';
import routes from './routes';

const preloadedState = window.__PRELOADED_STATE__;
// Create an enhanced history that syncs navigation events with the store
const history = createHistory();
const store = configureStore(preloadedState, history);
const rootEl = document.getElementById('app');

const renderApp = Component => {
	ReactDOM.render(
		<Provider store={store}>
			<ConnectedRouter history={history}>
				<Component>{routes}</Component>
			</ConnectedRouter>
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
