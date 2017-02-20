import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components';
import NotFoundPage from './pages/notfound';
import HomePage from './pages/home';
import SigninPage from './pages/signin';

export {
  NotFoundPage
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="signin"component={SigninPage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);