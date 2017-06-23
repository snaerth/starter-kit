import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';

const App = ({ children, name }) =>
  <AppLayout>
    <Header name={name} />
    <CSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}>
      <main>{children}</main>
    </CSSTransitionGroup>
  </AppLayout>;

App.propTypes = {
  children: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
};

function mapStateToProps(state, ownProps) {
  const routes = ownProps.children.props.children;
  const pathName = state.routing.location.pathname;

  // Filter route by current location path
  const route = routes.filter(route => {
    if (route && route.props.path === pathName) {
      return route.props.name;
    }
  });

  return { ...state, name: route[0].props.name };
}

export default connect(mapStateToProps)(App);
