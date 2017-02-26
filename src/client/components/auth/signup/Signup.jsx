import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './signup.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';
import Error from '../../common/error';
import * as actionCreators from './../../../actions';
import {validateEmail} from './../../../utils/validate';

/**
 * Signup component
 */
class Signup extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        SignupUser: PropTypes.func,
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
    handleFormSubmit({email, password}) {
        this
            .props
            .actions
            .SignupUser({email, password});
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
                    <Error strongText="Error: " text={errorMessage}/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit, errorMessage} = this.props;

        return (
            <div className={styles.container}>
                <MainHeading text="SIGN UP"/> {this.renderError(errorMessage)}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
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
                        <div>
                            <Button text="Sign up" ariaLabel="Sign up" className="fullWidth"/>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

function validate({email, password}) {
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
        'email', 'password'
    ],
    validate
})(Signup));
