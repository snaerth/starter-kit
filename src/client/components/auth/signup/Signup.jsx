import React, {PropTypes, Component} from 'react';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './Signup.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';

/**
 * Signin component
 */
class Signup extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    handleFormSubmit({email, password}) {
        console.log(email, password);
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <div className={styles.container}>
                <MainHeading text="SIGN IN"/>
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <fieldset>
                        <Field component={Input} name="email" id="email" type="email" label="Email"/>
                    </fieldset>
                    <fieldset>
                        <Field component={Input} name="password" id="password" type="password" label="Password"/>
                    </fieldset>
                    <fieldset>
                        <div>
                            <Button text="Send" ariaLabel="Send" className="fullWidth"/>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

export default reduxForm({
    form: 'signin',
    fields: ['email', 'password']
})(Signup);