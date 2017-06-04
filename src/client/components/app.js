import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';
import { Route } from 'react-router-dom';
import requireAuth from './../containers/requireAuth';
import pageWrapper from './../containers/pageWrapper';
import NotFound from './../routes/notfound';
import Home from './../routes/home';
import Signin from './../components/auth/signin';
import Signup from './../components/auth/signup';
import Signout from './../routes/signout';
import ForgotPassword from './../components/auth/forgotPassword';
import ResetPassword from './../components/auth/resetPassword';
import Profile from './../routes/profile';
import Admin from './../routes/admin';
export { NotFound };

const App = () => (
  <AppLayout>
    <Header name="Nafn á síðu" />
    <CSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}
    >
      <Route path="/" name="My application name" component={Home} />
      <Route path="signin" name="Sign in" component={pageWrapper(Signin)} />
      <Route path="signup" name="Sign up" component={pageWrapper(Signup)} />
      <Route path="signout" name="Sign out" component={pageWrapper(Signout)} />
      <Route
        path="forgotpassword"
        name="Forgot password"
        component={pageWrapper(ForgotPassword)}
      />
      <Route
        path="reset/:token"
        name="Reset password"
        component={pageWrapper(ResetPassword)}
      />
      <Route
        path="profile"
        name="Profile"
        component={requireAuth(pageWrapper(Profile))}
      />
      <Route
        path="admin"
        name="Admin"
        component={requireAuth(pageWrapper(Admin), 'admin')}
      />
      <Route
        path="*"
        name="404 Page not found"
        component={pageWrapper(NotFound)}
      />
    </CSSTransitionGroup>
  </AppLayout>
);

export default App;
