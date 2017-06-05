import React from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';
import routes from './../routes';

const App = () => (
  <AppLayout>
    <Header name="Nafn á síðu" />
    <CSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}
    >
      {routes}
    </CSSTransitionGroup>
  </AppLayout>
);

export default App;
