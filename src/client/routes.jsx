import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/app.jsx';
import NotFoundPage from './pages/notfound/NotFoundPage.jsx';
import HomePage from './pages/home/HomePage.jsx';

export {
  NotFoundPage
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={HomePage} />
    <Route path="*" component={NotFoundPage} />
  </Route>
);