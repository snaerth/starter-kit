import React from 'react';
import { Route, Switch } from 'react-router-dom';
import requireAuth from './../containers/requireAuth';
import pageWrapper from './../containers/pageWrapper';
import NotFound from './notfound';
import Home from './home';
import Signin from './../components/auth/signin';
import Signup from './../components/auth/signup';
import Signout from './signout';
import ForgotPassword from './../components/auth/forgotPassword';
import ResetPassword from './../components/auth/resetPassword';
import Profile from './profile';
import Admin from './admin';
export { NotFound };

export default (
  <Switch>
    <Route path="/" name="My application name" component={Home} />
    <Route path="/signin" name="Sign in" component={pageWrapper(Signin)} />
    <Route path="/signup" name="Sign up" component={pageWrapper(Signup)} />
    <Route path="/signout" name="Sign out" component={pageWrapper(Signout)} />
    <Route
      path="/forgotpassword"
      name="Forgot password"
      component={pageWrapper(ForgotPassword)}
    />
    <Route
      path="/reset/:token"
      name="Reset password"
      component={pageWrapper(ResetPassword)}
    />
    <Route
      path="/profile"
      name="Profile"
      component={requireAuth(pageWrapper(Profile))}
    />
    <Route
      path="/admin"
      name="Admin"
      component={requireAuth(pageWrapper(Admin), 'admin')}
    />
    <Route
      name="404 Page not found"
      component={pageWrapper(NotFound)}
    />
  </Switch>
);
