import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './../components/auth/requireAuth';
import App from './../components';
import NotFound from './notfound';
import Home from './home';
import Signin from './signin';
import Signup from './signup';
import Signout from './signout';
import Profile from './profile';

export {
  NotFound
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}  />
    <Route path="signin" component={Signin}  />
    <Route path="signup" component={Signup} />
    <Route path="signout" component={Signout}  />
    <Route path="profile" component={requireAuth(Profile)} />
    <Route path="*" component={NotFound} />
  </Route>
);