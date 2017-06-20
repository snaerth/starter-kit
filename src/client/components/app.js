import React, { PropTypes } from 'react';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';

const App = ({ children }) => (
  <AppLayout>
    <Header name={'sdfds'} />
    <CSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}
    >
      {children}
    </CSSTransitionGroup>
  </AppLayout>
);

App.propTypes = {
  children: PropTypes.object.isRequired
};

export default App;
