import React from 'react';
import { Route, IndexRoute } from 'react-router';
import requireAuth from './../components/auth/requireAuth';
import PageWrapper from './pageWrapper';
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
    <Route path="signin" component={PageWrapper(Signin)}  />
    <Route path="signup" component={PageWrapper(Signup)} />
    <Route path="signout" component={PageWrapper(Signout)}  />
    <Route path="forgotpassword" component={PageWrapper(ForgotPassword)}  />
    <Route path="profile" component={requireAuth(PageWrapper(Profile))} />
    <Route path="admin" component={requireAuth(PageWrapper(Admin), 'admin')} />
    <Route path="*" component={PageWrapper(NotFound)} />
  </Route>
);