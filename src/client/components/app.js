import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';

class App extends Component {
	static propTypes = {
		children: PropTypes.object.isRequired
	};


	render() {
		return (
			<AppLayout>
				<Header name={this.props.name} />
				<CSSTransitionGroup
					component="div"
					transitionName="fadeInScale"
					transitionEnterTimeout={700}
					transitionLeaveTimeout={700}
				>
					{this.props.children}
				</CSSTransitionGroup>
			</AppLayout>
		);
	}
}

function mapStateToProps(state, ownProps) {
  let name = 'My application';
  console.log(ownProps);
  const routes = ownProps.children.props.children;

  	for (let i = 0; i < routes; i++) {
  		if (routes[i] && routes[i].props.path === state.routing.location.pathname) {
			  name = children[i].props.name
		}
	}

	return { ...state, name};
}

export default connect(mapStateToProps)(App);
