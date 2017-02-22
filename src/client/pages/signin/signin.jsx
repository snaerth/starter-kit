import React, { Component } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import SigninForm from './../../components/auth/signin';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div>
                <ReactCSSTransitionGroup
                    component="div"
                    transitionName="fadeIn"
                    transitionEnterTimeout={500}
                    transitionLeaveTimeout={250}>
                    <SigninForm />
                </ReactCSSTransitionGroup>
            </div>
        );
    }
}

export default Signin;