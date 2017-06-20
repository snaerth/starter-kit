import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CSSTransitionGroup } from 'react-transition-group';
import AppLayout from './app-layout';
import Header from './common/header';
import routes from './../routes';

class App extends Component {
	render() {
		return (
			<AppLayout>
				<Header name={'dfdf'} />
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
	}
}

function mapStateToProps(state) {
	console.log(state);
}

export default connect(mapStateToProps)(App);
