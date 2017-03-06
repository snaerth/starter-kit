import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router';
import Button from '../../../components/common/button';
import Banner from '../../../components/common/banner';
import * as actions from '../../../components/auth/actions';

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
                <Banner text="SIGN OUT"/>
                <div>You have successfully been signed out. You can <Link to="signin" className="link-slideright">sign in</Link> again at any time.</div>
                <br/>
                <Link to="/"><Button text="Back to home" ariaLabel="Back to home"/></Link>
            </div>
        );
    }
}

export default connect(null, actions)(Signout);