import React, {Component} from 'react';
import SignupForm from './../../components/auth/signup';

/**
 * Signin component
 */
class Signup extends Component {
    render() {
        return (
            <div>
                <SignupForm />
            </div>
        );
    }
}

export default Signup;