import React, { PropTypes, Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import Input from '../../common/input';
import Password from '../../common/password';
import styles from './Signup.scss';
import Button from '../../common/button';
import MainHeading from '../../common/mainheading';
import NotifyBox from '../../common/notifyBox';
import FileUploader from '../../common/fileUploader';
import Spinner from '../../common/spinner';
import * as actionCreators from '../actions';
import { validateEmail } from './../../../utils/validate';
import classnames from 'classnames';

/**
 * Signup component
 */
class Signup extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        signupUser: PropTypes.func,
        actions: PropTypes.object.isRequired,
        errorMessage: PropTypes.string,
        image: PropTypes.object,
        isFetching: PropTypes.bool
    }

    constructor(props) {
        super(props);

        this.handleFormSubmit = this
            .handleFormSubmit
            .bind(this);
        this.onDrop = this
            .onDrop
            .bind(this);

    }

    componentWillMount() {
        this
            .props
            .actions
            .setPreviewUserImage(null);
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
            .isFetching();
        let formData = null;

        if (this.props.image) {
            formData = new FormData();
            formData.append('image', this.props.image);
        }

        this
            .props
            .actions
            .signupUser({ email, password, name, formData });
    }

    /**
     * Handles on drop for dropzone component
     *
     * @param {Array} acceptedFiles
     * @param {Array} rejectedFiles
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    onDrop(acceptedFiles, rejectedFiles) {
        if (rejectedFiles.length > 0) {
            this.props.errorMessage = 'Only images allowed.';
            return;
        }
        if (acceptedFiles.length > 0) {
            this
                .props
                .actions
                .setPreviewUserImage(acceptedFiles[0]);
        }
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
                    <NotifyBox strongText="Error: " text={errorMessage} type="error" />
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit, errorMessage, isFetching} = this.props;

        return (
            <div className={classnames(styles.cardContainer, 'card')}>
                <MainHeading text="SIGN UP" /> {this.renderError(errorMessage)}
                {isFetching
                    ? <Spinner>Signing up</Spinner>
                    : <form
                        onSubmit={handleSubmit(this.handleFormSubmit)}
                        noValidate
                        autoComplete="off">
                        <fieldset>
                            <Field
                                component={Input}
                                name="name"
                                id="name"
                                type="text"
                                label="Name"
                                placeholder="Full name" />
                        </fieldset>
                        <fieldset>
                            <Field
                                component={Input}
                                name="email"
                                id="email"
                                type="email"
                                label="Email"
                                placeholder="someone@example.com" />
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
                            <FileUploader
                                accept="image/*"
                                onDrop={this.onDrop}
                                multiple={false}
                                image={this.props.image} />
                        </fieldset>
                        <fieldset className={styles.fieldsetButton}>
                            <div>
                                <Button text="Sign up" ariaLabel="Sign up" className="fullWidth" />
                            </div>
                        </fieldset>
                    </form>}
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

    if (!/^([^0-9]*)$/.test(name) || (name && name.trim().split(' ').length < 2)) {
        errors.name = 'Name has aleast two names consisting of letters';
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
    return { errorMessage: state.auth.error, image: state.auth.image, isFetching: state.auth.isFetching };
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
        'name', 'email', 'password', 'image'
    ],
    validate
})(Signup));
