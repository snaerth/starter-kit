import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import * as actions from '../../actions';

/**
 * Signout component
 */
class Signout extends Component {
    static propTypes = {
        signoutUser: PropTypes.func
    }

    componentWillMount() {
        this.props.signoutUser();
    }

    render() {
        return (
            <div className="page">
                <div>Back to home page perhaps???</div>
            </div>

        );
    }
}

export default connect(null, actions)(Signout);