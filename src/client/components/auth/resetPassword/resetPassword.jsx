import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Password from '../../common/password';
import styles from './resetPassword.scss';
import Button from '../../common/button';
import Banner from './../../../components/common/banner';
import NotifyBox from '../../common/notifyBox';
import * as actionCreators from '../actions';

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
        } else if(message) {
            return (
                <fieldset>
                    <NotifyBox strongText="Success: " text={message} type="success"/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <div>
                <Banner text="Reset password"/>
                <div className={styles.container}>
                    {this.renderMessages()}
                    <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} noValidate autoComplete="off">
                        <fieldset>
                            <Field
                                component={Password}
                                name="password"
                                id="password"
                                type="password"
                                label="New password"/>
                        </fieldset>
                        <fieldset>
                            <Button text="Reset password" ariaLabel="Reset password" className="fullWidth"/>
                        </fieldset>
                    </form>
                </div>
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
    return {
        errorMessage: state.auth.error,
        message: state.auth.message
    };
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'signin', fields: ['password'], validate})(ResetPassword));
