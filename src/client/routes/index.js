import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './../components/auth/requireAuth';
import App from './../components';
import NotFound from './notfound';
import Home from './home';
import Signin from './auth/signin';
import Signup from './auth/signup';
import Signout from './auth/signout';
import ForgotPassword from './auth/forgotPassword';
import Profile from './profile';
import Admin from './admin';

export {
  NotFound
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}  />
    <Route path="signin" component={Signin}  />
    <Route path="signup" component={Signup} />
    <Route path="signout" component={Signout}  />
    <Route path="forgotpassword" component={ForgotPassword}  />
    <Route path="profile" component={requireAuth(Profile)} />
    <Route path="admin" component={requireAuth(Admin, 'admin')} />
    <Route path="*" component={NotFound} />
  </Route>
);