import React, {Component} from 'react';
import SigninForm from './../../components/auth/signin';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div className="page">
                <SigninForm/>
            </div>
        );
    }
}

export default Signin;