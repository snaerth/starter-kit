import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Input from '../../common/input';
import Password from '../../common/password';
import styles from './Signup.scss';
import Button from '../../common/button';
import MainHeading from '../../common/mainheading';
import NotifyBox from '../../common/notifyBox';
import * as actionCreators from '../actions';
import {validateEmail} from './../../../utils/validate';
import Dropzone from 'react-dropzone';
import UploadPhoto from './uploadPhoto.svg';
import Face from './face.svg';

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
        image: PropTypes.object
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

    /**
     * Handles form submit event
     *
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
    handleFormSubmit({email, password, name}) {
        let formData = null;

        if (this.props.image) {
            formData = new FormData();
            formData.append('image', this.props.image);
        }

        this
            .props
            .actions
            .signupUser({email, password, name, formData});
    }

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
                    <NotifyBox strongText="Error: " text={errorMessage} type="error"/>
                </fieldset>
            );
        }
    }

    render() {
        const {handleSubmit, errorMessage} = this.props;

        return (
            <div className="card">
                <MainHeading text="SIGN UP"/> {this.renderError(errorMessage)}
                <form
                    onSubmit={handleSubmit(this.handleFormSubmit)}
                    noValidate
                    autoComplete="off">
                    <fieldset>
                        <Field component={Input} name="name" id="name" type="text" label="Name"/>
                    </fieldset>
                    <fieldset>
                        <Field component={Input} name="email" id="email" type="email" label="Email"/>
                    </fieldset>
                    <fieldset>
                        <Field
                            component={Password}
                            name="password"
                            id="password"
                            type="password"
                            label="Password"/>
                    </fieldset>
                    <fieldset>
                        <div className={styles.uploadPhotoContainer}>
                            <Dropzone
                                onDrop={this.onDrop}
                                multiple={false}
                                accept="image/*"
                                className={styles.dropzoneContainer}>
                                <div className={styles.dropzoneContainerInner}>
                                    <div className={styles.dropzoneBoxImage}>
                                        <UploadPhoto width="50" height="50" className={styles.svg}/>
                                    </div>
                                    <div className={styles.dropzoneBoxText}>Drop image here or click to select image to upload.</div>
                                </div>
                            </Dropzone>
                            <ReactCSSTransitionGroup
                                component="div"
                                transitionName="fadeInScale"
                                className={styles.imageContainer}
                                transitionEnterTimeout={700}
                                transitionLeaveTimeout={350}>
                                {this.props.image
                                    ? <img
                                            key="profileImage"
                                            src={this.props.image.preview}
                                            className={styles.imagePreviewContainer}/>
                                    : <div className={styles.fakeFrame}>
                                        <span className="visually-hidden">Image frame</span>
                                        <Face width="100" height="100" className={styles.svg}/>
                                    </div>
}
                            </ReactCSSTransitionGroup>
                        </div>
                    </fieldset>
                    <fieldset className={styles.fieldsetButton}>
                        <div>
                            <Button text="Sign up" ariaLabel="Sign up" className="fullWidth"/>
                        </div>
                    </fieldset>
                </form>
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
    return {errorMessage: state.auth.error, image: state.auth.image};
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
