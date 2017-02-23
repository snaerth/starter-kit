import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Input from '../../common/input';
import styles from './Signup.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div className={styles.container}>
                <MainHeading text="SIGN UP" />
                <form>
                    <fieldset>
                        <Input label="Email" id="email" type="email" />
                    </fieldset>
                    <fieldset>
                        <Input label="password" id="password" type="password" />
                    </fieldset>
                    <fieldset>
                        <div>
                            <Button text="Sign up" ariaLabel="Sign up" className="fullWidth" />
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'signin',
    fields: ['email', 'passpword']
})(Signin);