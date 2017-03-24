import React, {PropTypes} from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';

const App = ({children, location}) => (
  <AppLayout>
    <Header name={children.props.route.name}/>
    <ReactCSSTransitionGroup
      component="div"
      transitionName="fadeInScale"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}>
      {React.cloneElement(children, {key: location.pathname})}
    </ReactCSSTransitionGroup>
  </AppLayout>
);

App.propTypes = {
  children: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired
};

export default App;