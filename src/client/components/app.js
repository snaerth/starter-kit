import React from 'react';
import PropTypes from 'prop-types';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';

const App = ({ children, location }) => (
  <AppLayout>
    <Header name={children.props.route.name} />
    <CSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}
    >
      {React.cloneElement(children, { key: location.pathname })}
    </CSSTransitionGroup>
  </AppLayout>
);

App.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default App;
