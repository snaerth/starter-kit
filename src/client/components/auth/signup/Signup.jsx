import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import Textarea from '../../common/textarea';
import styles from './signup.scss';
import Button from '../../common/button';
import Banner from './../../../components/common/banner';
import NotifyBox from '../../common/notifyBox';
import * as actionCreators from '../actions';
import {validateEmail} from './../../../utils/validate';

/**
 * Signup component
 */
class Signup extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        signupUser: PropTypes.func,
        actions: PropTypes.object.isRequired,
        errorMessage: PropTypes.string
    }

    /**
     * Handles form submit event
     *
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    handleFormSubmit({email, password, name}) {
        this
            .props
            .actions
            .signupUser({email, password, name});
    }

    /**
     * Renders error message box
     *
     * @param {String} errorMessage - Error message
     * @returns {JSX}
     * @author Snær Seljan Þóroddsson
     */
    renderError(errorMessage) {
        if (errorMessage) {
            return (
                <fieldset>
                    <NotifyBox strongText="Error: " text={errorMessage} type="error"/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit, errorMessage} = this.props;

        return (
            <div>
                <Banner text="SIGN UP"/>
                <div className={styles.container}>
                    {this.renderError(errorMessage)}
                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} noValidate>
                        <fieldset>
                            <Field component={Input} name="name" id="name" type="text" label="Name"/>
                        </fieldset>
                        <fieldset>
                            <Field component={Input} name="email" id="email" type="email" label="Email"/>
                        </fieldset>
                        <fieldset>
                            <Field
                                component={Input}
                                name="password"
                                id="password"
                                type="password"
                                label="Password"/>
                        </fieldset>
                        <fieldset>
                            <Field component={Textarea} name="message" id="message" label="Message"/>
                        </fieldset>
                        <fieldset>
                            <div>
                                <Button text="Sign up" ariaLabel="Sign up" className="fullWidth"/>
                            </div>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

/**
 * Validates form inputs, both email, password and message
 *
 * @param {String} email
 * @param {String} password
 * @param {String} name
 * @return {Object} errors
 * @author Snær Seljan Þóroddsson
 */
function validate({email, password, name}) {
    const errors = {};

    // Email
    if (!validateEmail(email)) {
        errors.email = `Email ${email} is not valid email`;
    }

    if (!email) {
        errors.email = 'Email required';
    }

    // Password
    if (!/[0-9]/.test(password) || !/[A-Z]/.test(password)) {
        errors.password = 'Password must contain at least one number (0-9) and one uppercase letter (A-Z)';
    }

    if (password && password.length < 6) {
        errors.password = 'The password must be of minimum length 6 characters';
    }

    if (!password) {
        errors.password = 'Password required';
    }

    // Name
    if (!name) {
        errors.name = 'Name required';
    }

    if (!/^([^0-9]*)$/.test(name) || name.trim().split(' ').length < 2) {
        errors.name = 'Name has aleast two names 2 words consisting of letters';
    }

    return errors;
}

/**
 * Maps state to components props
 *
 * @param {Object} state - Application state
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
function mapStateToProps(state) {
    return {errorMessage: state.auth.error};
}

/**
 * Maps dispatch to components props
 *
 * @param {Object} dispatch - Redux dispatch medhod
 * @returns {Object}
 * @author Snær Seljan Þóroddsson
 */
function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
}

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({
    form: 'signup',
    fields: [
        'name', 'email', 'password', 'message'
    ],
    validate
})(Signup));
