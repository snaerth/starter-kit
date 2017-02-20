import React, {Component} from 'react';
import SigninForm from './../../components/auth/signin';
import MainHeading from './../../components/common/mainheading';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div>
                <MainHeading text="SIGN IN" />
                <SigninForm />
            </div>
        );
    }
}

export default Signin;