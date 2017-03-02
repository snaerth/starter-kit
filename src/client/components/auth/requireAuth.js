import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

export default function (ComposedComponent, userRole) {
    class Authentication extends Component {
        static propTypes = {
            authenticated: PropTypes.bool,
            role: PropTypes.string
        }

        static contextTypes = {
            router: PropTypes.object
        }

        componentWillMount() {
            if (!this.props.authenticated) {
                this.context.router.push('/signin');
            } else {
                if (userRole === 'admin' && this.props.role !== 'admin') {
                    this.context.router.push('/');
                }
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                this.context.router.push('/signin');
            } else {
                if (userRole === 'admin' && nextProps.role !== 'admin') {
                    this.context.router.push('/');
                }
            }
        }

        render() {
            return <ComposedComponent {...this.props}/>;
        }
    }

    function mapStateToProps(state) {
        let newStateToProps = {
            authenticated: state.auth.authenticated
        };

        if (state.auth.role) {
            newStateToProps.role = state.auth.role;
        }

        return newStateToProps;
    }

    return connect(mapStateToProps)(Authentication);
}