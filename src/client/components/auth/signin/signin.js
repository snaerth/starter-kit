import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import Input from '../../common/input';
import styles from './signin.scss';
import Button from '../../common/button';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div className={styles.container}>
                <form>
                    <fieldset>
                        <Input label="Email" id="email" />
                    </fieldset>
                    <Button text="Senda" ariaLabel="Senda" color="red"/>
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'signin',
    fields: ['email', 'passpword']
})(Signin);