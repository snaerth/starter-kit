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
