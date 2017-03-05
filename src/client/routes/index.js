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
import Profile from './profile';
import Admin from './admin';

export {
  NotFound
};

export default (
  <Route path="/" component={App}>
    <IndexRoute component={Home}  />
    <Route path="signin" component={pageWrapper(Signin)}  />
    <Route path="signup" component={pageWrapper(Signup)} />
    <Route path="signout" component={pageWrapper(Signout)}  />
    <Route path="forgotpassword" component={pageWrapper(ForgotPassword)}  />
    <Route path="profile" component={requireAuth(pageWrapper(Profile))} />
    <Route path="admin" component={requireAuth(pageWrapper(Admin), 'admin')} />
    <Route path="*" component={pageWrapper(NotFound)} />
  </Route>
);