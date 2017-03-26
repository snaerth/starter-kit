import React, { PropTypes, Component } from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import Input from '../../common/input';
import Password from '../../common/password';
import styles from './signin.scss';
import Button from '../../common/button';
import NotifyBox from '../../common/notifyBox';
import MainHeading from '../../common/mainheading';
import { validateEmail } from './../../../utils/validate';
import Spinner from '../../common/spinner';
import * as actionCreators from '../actions';
import Email from '../../../common/svg/email.svg';
import ArrowForward from '../../../common/svg/arrow_forward.svg';

/**
 * Signin component
 */
class Signin extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        signinUser: PropTypes.func,
        actions: PropTypes.object.isRequired,
        errorMessage: PropTypes.string,
        isFetching: PropTypes.bool
    }

    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.facebookSignin = this.facebookSignin.bind(this);
    }

    componentWillMount() {
        this.props.actions.clean();
    }

    /**
     * Handles form submit event
     *
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    handleFormSubmit({ email, password }) {
        this.props.actions.isFetching();
        this.props.actions.signinUser({ email, password });
    }

    facebookSignin() {
        this.props.actions.signinFacebook();
    }

    /**
     * Renders error message box
     *
     * @returns {JSX}
     * @author Snær Seljan Þóroddsson
     */
    renderError() {
        const { errorMessage } = this.props;

        if (errorMessage) {
            return (
                <fieldset>
                    <NotifyBox strongText="Error: " text={errorMessage} type="error" />
                </fieldset>
            );
        }
    }

    render() {
        const { handleSubmit, isFetching } = this.props;

        return (
            <div>
                <div className="card">
                    {isFetching
                        ? <Spinner>Signing in</Spinner>
                        : <div>
                            <MainHeading text="SIGN IN" />
                            {this.renderError()}
                            <form onSubmit={handleSubmit(this.handleFormSubmit)} noValidate>
                                <fieldset>
                                    <Field
                                        component={Input}
                                        name="email"
                                        id="email"
                                        type="email"
                                        label="Email"
                                        placeholder="someone@example.com"><Email /></Field>
                                </fieldset>
                                <fieldset>
                                    <Field
                                        component={Password}
                                        name="password"
                                        id="password"
                                        type="password"
                                        label="Password"
                                        placeholder="Must have at least 6 characters" />
                                </fieldset>
                                <fieldset>
                                    <div>
                                        <Button text="Sign in" ariaLabel="Sign in" className="fullWidth">
                                            <ArrowForward className={styles.iconArrowForward} />
                                        </Button>
                                        <Button type="button" text="Loin with facebook" ariaLabel="Login with facebook" className="fullWidth" onClick={() => this.facebookSignin()}>
                                            <ArrowForward className={styles.iconArrowForward} />
                                        </Button>
                                    </div>
                                    <div className={styles.forgotPasswordContainer}>
                                        <Link to="forgotpassword" className="link-slideright">Forgot password?</Link>
                                    </div>
                                </fieldset>
                            </form>
                        </div>}
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
function validate({ email, password }) {
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
    return { errorMessage: state.auth.error, isFetching: state.auth.isFetching };
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
