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

export {
  NotFound
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}  />
    <Route path="signin" name="Sign in" component={pageWrapper(Signin)}  />
    <Route path="signup" name="Sign up" component={pageWrapper(Signup)} />
    <Route path="signout" name="Sign out" component={pageWrapper(Signout)}  />
    <Route path="forgotpassword" name="Forgot password" component={pageWrapper(ForgotPassword)}  />
    <Route path="reset/:token" name="Reset password" component={pageWrapper(ResetPassword)}  />
    <Route path="profile" name="Profile" component={pageWrapper(Profile)} />
    <Route path="admin" name="Admin" component={requireAuth(pageWrapper(Admin), 'admin')} />
    <Route path="*" component={pageWrapper(NotFound)} />
  </Route>
);