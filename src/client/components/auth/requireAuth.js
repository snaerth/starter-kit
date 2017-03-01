import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

export default function (ComposedComponent, requireAdmin) {
    class Authentication extends Component {
        static propTypes = {
            authenticated: PropTypes.bool
        }

        static contextTypes = {
            router: PropTypes.object
        }

        componentWillMount() {
            if (!this.props.authenticated) {
                this
                    .context
                    .router
                    .push('/signin');
            }
        }

        componentWillUpdate(nextProps) {
            if (!nextProps.authenticated) {
                this
                    .context
                    .router
                    .push('/signin');
            }
        }

        render() {
            return <ComposedComponent {...this.props}/>;
        }
    }

    function mapStateToProps(state) {
        let mappedObj = {
            authenticated: state.auth.authenticated
        };

        if(requireAdmin && state.auth.role) {
            mappedObj.role = state.auth.role;
        }
        
        return mappedObj;
    }

    return connect(mapStateToProps)(Authentication);
}