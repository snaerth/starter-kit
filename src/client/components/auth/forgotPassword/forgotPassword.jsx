import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Password from '../../common/password';
import Button from '../../common/button';
import MainHeading from '../../common/mainheading';
import NotifyBox from '../../common/notifyBox';
import {validateEmail} from './../../../utils/validate';
import * as actionCreators from '../actions';

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
        message: PropTypes.string
    }

    /**
     * Handles form submit event
     *
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    handleFormSubmit({email}) {
        this
            .props
            .actions
            .forgotPassword({email});
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
                <fieldset>
                    <NotifyBox strongText="Success: " text={message} type="success"/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <div className="card">
                <MainHeading text="Forgot password"/> {this.renderMessages()}
                <form
                    onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}
                    noValidate
                    autoComplete="off">
                    <fieldset>
                        <Field component={Password} name="email" id="email" type="email" label="Email"/>
                    </fieldset>
                    <fieldset>
                        <div>
                            <Button text="Reset password" ariaLabel="Reset password" className="fullWidth"/>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
}

/**
 * Validates form inputs, both email and password
 *
 * @param {String} email
 * @return {Object} errors
 * @author Snær Seljan Þóroddsson
 */
function validate({email}) {
    const errors = {};

    // Email
    if (!validateEmail(email)) {
        errors.email = `Email ${email} is not valid email`;
    }

    if (!email) {
        errors.email = 'Email required';
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
    return {errorMessage: state.auth.error, message: state.auth.message};
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

export default connect(mapStateToProps, mapDispatchToProps)(reduxForm({form: 'signin', fields: ['email'], validate})(Signin));
