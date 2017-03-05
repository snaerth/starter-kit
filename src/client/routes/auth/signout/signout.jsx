import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import * as actions from '../../../actions';

/**
 * Signout component
 */
class Signout extends Component {
    static propTypes = {
        signoutUser: PropTypes.func
    }

    componentWillMount() {
        this
            .props
            .signoutUser();
    }

    render() {
        return (
            <div className="container">
                <div>You are signed out. You can sign in again here</div>
                <Link to="/" className="underline">Home</Link>
            </div>
        );
    }
}

export default connect(null, actions)(Signout);