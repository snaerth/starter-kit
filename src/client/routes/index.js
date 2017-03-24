import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './../containers/requireAuth';
import pageWrapper from './../containers/pageWrapper';
import App from './../components';
import NotFound from './notfound';
import Home from './home';
import Signin from './../components/auth/signin';
import Signup from './../components/auth/signup';
import Signout from './auth/signout';
import ForgotPassword from './../components/auth/forgotPassword';
import ResetPassword from './../components/auth/resetPassword';
import Profile from './profile';
import Admin from './admin';
import getRoute from './../utils/getRoute';

export {
  NotFound
};

export default (
  <Route path="/" component={App}>
    <IndexRoute getComponent={getRoute(Home)} name="My application name" />
    <Route path="signin" name="Sign in" getComponent={pageWrapper(getRoute(Signin))}  />
    <Route path="signup" name="Sign up" getComponent={pageWrapper(getRoute(Signup))} />
    <Route path="signout" name="Sign out" getComponent={pageWrapper(getRoute(Signout))}  />
    <Route path="forgotpassword" name="Forgot password" getComponent={pageWrapper(getRoute(ForgotPassword))}  />
    <Route path="reset/:token" name="Reset password" getComponent={pageWrapper(getRoute(ResetPassword))}  />
    <Route path="profile" name="Profile" getComponent={pageWrapper(getRoute(Profile))} />
    <Route path="admin" name="Admin" getComponent={requireAuth(pageWrapper(getRoute(Admin)), 'admin')} />
    <Route path="*" name="404 Page not found" getComponent={pageWrapper(getRoute(NotFound))} />
  </Route>
);