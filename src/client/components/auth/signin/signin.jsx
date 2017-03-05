import React, {PropTypes, Component} from 'react';
import {Link} from 'react-router';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './signin.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';
import Error from '../../common/error';
import {validateEmail} from './../../../utils/validate';
import * as actionCreators from './../../../actions';
import {Row, Col} from 'react-flexbox-grid';

/**
 * Signin component
 */
class Signin extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        signinUser: PropTypes.func,
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
            .signinUser({email, password});
    }

    /**
     * Renders error message box
     *
     * @returns {JSX}
     * @author Snær Seljan Þóroddsson
     */
    renderError() {
        const {errorMessage} = this.props;

        if (errorMessage) {
            return (
                <fieldset>
                    <Error strongText="Error: " text={errorMessage}/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <div>
                <MainHeading text="SIGN IN"/>
                <div className={styles.container}>
                    {this.renderError()}
                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} noValidate>
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
                            <Row>
                                <Col xs={6} md={6}>
                                    <Link to="forgotpassword">Forgot password?</Link>
                                </Col>
                                <Col xs={6} md={6}>
                                    <Button text="Send" ariaLabel="Send" className="fullWidth"/>
                                </Col>
                            </Row>
                        </fieldset>
                    </form>
                </div>
            </div>
        );
    }
}

/**
 * Validates form inputs, both email and password
 *
 * @param {String} email
 * @param {String} password
 * @return {Object} errors
 * @author Snær Seljan Þóroddsson
 */
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
    form: 'signin',
    fields: [
        'email', 'password'
    ],
    validate
})(Signin));
