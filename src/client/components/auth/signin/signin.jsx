import React, { Component } from 'react';
import { reduxForm } from 'redux-form';
import Input from '../../common/input';
import styles from './signin.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div className={styles.container}>
                <MainHeading text="SIGN IN" />
                <form>
                    <fieldset>
                        <Input label="Email" id="email" type="email" />
                    </fieldset>
                    <fieldset>
                        <Input label="password" id="password" type="password" />
                    </fieldset>
                    <fieldset>
                        <div>
                            <Button text="Send" ariaLabel="Send" color="red" className="fullWidth" />
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