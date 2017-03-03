import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './forgotPassword.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';
import Error from '../../common/error';
import {validateEmail} from './../../../utils/validate';
import * as actionCreators from './../../../actions';

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
    handleFormSubmit({email}) {
        this
            .props
            .actions
            .forgotPassword({email});
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
            <div className={styles.container}>
                <MainHeading text="Forgot password"/> {this.renderError()}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))} noValidate>
                    <fieldset>
                        <Field component={Input} name="email" id="email" type="email" label="Email"/>
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
    fields: ['email'],
    validate
})(Signin));
