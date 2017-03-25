import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import {Link} from 'react-router';
import styles from './resetPassword.scss';
import Password from '../../common/password';
import Button from '../../common/button';
import NotifyBox from '../../common/notifyBox';
import * as actionCreators from '../actions';
import Spinner from '../../common/spinner';
import ArrowForward from '../../../common/svg/arrow_forward.svg';

/**
 * Signin component
 */
class ResetPassword extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        resetPassword: PropTypes.func,
        actions: PropTypes.object.isRequired,
        errorMessage: PropTypes.string,
        message: PropTypes.string,
        token: PropTypes.string,
        params: PropTypes.object,
        isFetching: PropTypes.bool
    }

    componentWillMount() {
        this
            .props
            .actions
            .clean();
    }

    /**
     * Handles form submit event
     *
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    handleFormSubmit({password}) {
        const token = this.props.params.token;
        this
            .props
            .actions
            .isFetching();
        this
            .props
            .actions
            .resetPassword({password, token});
    }

    /**
     * Renders messages in a notifycation box
     *
     * @returns {JSX}
     * @author Snær Seljan Þóroddsson
     */
    renderMessages() {
        const {errorMessage, message} = this.props;

        if (errorMessage) {
            return (
                <fieldset>
                    <NotifyBox strongText="Error: " text={errorMessage} type="error"/>
                </fieldset>
            );
        } else if (message) {
            return (
                <div>
                    <fieldset>
                        <NotifyBox text={message} type="success"/>
                    </fieldset>
                    <fieldset>
                        <Link to="/signin"><Button text="Sign in" className="fullWidth" ariaLabel="Sign in"/></Link>
                    </fieldset>
                </div>
            );
        }
    }

    render() {
        const {handleSubmit, isFetching, message} = this.props;

        return (
            <div className="card">
                {!isFetching
                    ? this.renderMessages()
                    : null}
                {isFetching
                    ? <Spinner>Resetting password</Spinner>
                    : !message
                        ? <form
                                onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                                noValidate
                                autoComplete="off">
                                <fieldset>
                                    <Field
                                        component={Password}
                                        name="password"
                                        id="password"
                                        type="password"
                                        label="New password"/>
                                </fieldset>
                                <fieldset>
                                    <Button text="Reset password" ariaLabel="Reset password" className="fullWidth">
                                        <ArrowForward className={styles.iconArrowForward} />
                                    </Button>
                                </fieldset>
                            </form>
                        : null}
            </div>
        );
    }
}

/**
 * Validates password input
 *
 * @param {String} password
 * @return {Object} errors
 * @author Snær Seljan Þóroddsson
 */
function validate({password}) {
    const errors = {};

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
    return {errorMessage: state.auth.error, message: state.auth.message, isFetching: state.auth.isFetching};
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'resetPassword', fields: ['password'], validate})(ResetPassword));
