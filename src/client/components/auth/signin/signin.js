import React, {Component} from 'react';
import {reduxForm} from 'redux-form';
import Input from '../../input';
import styles from './signin.scss';

/**
 * Signin component
 */
class Signin extends Component {
    render() {
        return (
            <div className={styles.container}>
                <form>
                    <fieldset>
                        <Input label="Email" id="email"/>
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