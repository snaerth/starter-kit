import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { TimelineLite, Power2 } from 'gsap';
import classnames from 'classnames';
import Input from '../../common/input';
import Password from '../../common/password';
import styles from './signin.scss';
import Button from '../../common/button';
import ButtonLink from '../../common/buttonLink';
import NotifyBox from '../../common/notifyBox';
import MainHeading from '../../common/mainheading';
import ForgotPassword from '../forgotPassword';
import { validateEmail } from './../../../utils/validate';
import Spinner from '../../common/spinner';
import * as actionCreators from '../actions';
import Email from '../../../common/svg/email.svg';
import ArrowForward from '../../../common/svg/arrow_forward.svg';
import FacebookIcon from '../../../common/svg/facebook.svg';
import TwitterIcon from '../../../common/svg/twitter.svg';
import GoogleIcon from '../../../common/svg/google.svg';

/**
 * Signin component
 */
class Signin extends Component {
  static propTypes = {
    handleSubmit: PropTypes.func.isRequired,
    signinUser: PropTypes.func,
    actions: PropTypes.object.isRequired,
    errorMessage: PropTypes.string,
    isFetching: PropTypes.bool,
  };

  constructor(props) {
    super(props);

    this.handleFormSubmit = this.handleFormSubmit.bind(this);
    this.toggleView = this.toggleView.bind(this);

    this.state = {
      currentSlide: 0,
      animateButtons: false,
    };
  }

  componentWillMount() {
    this.props.actions.clean();
  }

  componentDidMount() {
    setTimeout(() => {
      this.animateStart();
      this.setState({ animateButtons: true });
    }, 100);
  }

  /**
     * Sign in start animation for buttons
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
  animateStart() {
    const tl = new TimelineLite();

    tl.staggerFrom(
      this.el0.children,
      1,
      { opacity: 0, delay: 0.1, ease: Power2.easeOut },
      0.1,
    );
  }

  /**
     * Handles form submit event
     * @param {Object}
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
  handleFormSubmit({ email, password }) {
    this.props.actions.isFetching();
    this.props.actions.signinUser({ email, password });
  }

  /**
     * Renders error message box
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

  /**
     * Toggles signin views BUTTONS or SIGN IN with email
     * @param {Object} e - Click handler event
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
  toggleView(e, slideNumber) {
    e.preventDefault();
    let { currentSlide } = this.state;
    let forward = true;
    let firstEl = this[`el${currentSlide}`];
    let secondEl = this[`el${slideNumber}`];

    // Check if backwards
    if (currentSlide > slideNumber) {
      forward = false;
      firstEl = this[`el${slideNumber}`];
      secondEl = this[`el${currentSlide}`];
    }

    this.animateSlide(firstEl, secondEl, forward);

    currentSlide = slideNumber;
    this.setState({ currentSlide });
  }

  /**
   * Animates slidein
   * @param {Object} firstEl
   * @param {Object} secondEl
   * @returns {undefined}
   * @author Snær Seljan Þóroddsson
   */
  animateSlide(firstEl, secondEl, forward) {
    const tl = new TimelineLite();

    if (forward) {
      tl
        .to(firstEl, 0.2, {
          x: '-110%',
          opacity: 1,
          ease: Power2.easeOut,
        })
        .to(secondEl, 0.2, {
          x: '0%',
          opacity: 1,
          ease: Power2.easeOut,
        });
    } else {
      tl
        .to(secondEl, 0.2, {
          x: '110%',
          opacity: 1,
          ease: Power2.easeOut,
        })
        .to(firstEl, 0.2, {
          x: '0%',
          opacity: 1,
          ease: Power2.easeOut,
        });
    }
  }

 /**
  * Renders sign in form with email and password
  * @param {func} handleSubmit
  * @returns {undefined}
  */
  renderForm(handleSubmit) {
    const {
      forgotPasswordContainer,
      formContainer,
      iconArrowForward,
      back,
    } = styles;

    return (
      <form
        onSubmit={handleSubmit(this.handleFormSubmit)}
        noValidate
        ref={c => (this.el1 = c)}
        className={formContainer}
      >
        <fieldset>
          <Field
            component={Input}
            name="email"
            id="email"
            type="email"
            label="Email"
            placeholder="someone@example.com"
          >
            <Email />
          </Field>
        </fieldset>
        <fieldset>
          <Field
            component={Password}
            name="password"
            id="password"
            type="password"
            label="Password"
            placeholder="Must have at least 6 characters"
          />
        </fieldset>
        <fieldset>
          <div>
            <Button text="Sign in" ariaLabel="Sign in" className="fullWidth">
              <ArrowForward className={iconArrowForward} />
            </Button>
          </div>
        </fieldset>
        <div
          role="button"
          tabIndex={0}
          className={forgotPasswordContainer}
          onClick={e => this.toggleView(e, 2)}
        >
          <Link role="button" to="forgotpassword" className="link-slideright">
            Forgot password?
          </Link>
        </div>
        <div className={back}>
          <button
            className="link-slideright"
            onClick={e => this.toggleView(e, 0)}
          >
            Back
          </button>
        </div>
      </form>
    );
  }

  /**
     * Renders socials sign in or sign up buttons
     *
     * @returns {undefined}
     */
  renderSocials() {
    const { buttonContainer, hidden, iconFacebook, iconArrowForward } = styles;
    const { animateButtons } = this.state;

    return (
      <div
        className={classnames(buttonContainer, !animateButtons ? hidden : '')}
        ref={c => (this.el0 = c)}
      >
        <ButtonLink
          href="/admin/auth/facebook"
          text="Continue with facebook"
          title="Facebook login"
          color="facebook"
          className="fullWidth"
        >
          <FacebookIcon className={iconFacebook} />
        </ButtonLink>
        <ButtonLink
          href="/admin/auth/twitter"
          text="Continue with Twitter"
          title="Twitter login"
          color="twitter"
          className="fullWidth"
        >
          <TwitterIcon className={iconFacebook} />
        </ButtonLink>
        <ButtonLink
          href="/admin/auth/google"
          text="Continue with Google"
          title="Google login"
          color="google"
          className="fullWidth"
        >
          <GoogleIcon className={iconFacebook} />
        </ButtonLink>
        <ButtonLink
          href="#"
          onClick={e => this.toggleView(e, 1)}
          text="Sign in with email"
          title="Sign in with email"
          className="fullWidth"
        >
          <ArrowForward className={iconArrowForward} />
        </ButtonLink>
      </div>
    );
  }

  /**
     * Renders ForgotPassword component
     *
     * @returns {undefined}
     */
  renderForgotPassword() {
    const { formContainer, back } = styles;

    return (
      <div ref={c => (this.el2 = c)} className={formContainer}>
        <ForgotPassword hideHeading />
        <div className={back}>
          <button
            className="link-slideright"
            onClick={e => this.toggleView(e, 1)}
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { handleSubmit, isFetching } = this.props;

    return (
      <div>
        <div className={classnames('card', styles.cardExtend)}>
          {isFetching
            ? <Spinner>Signing in</Spinner>
            : <div>
              <MainHeading text="SIGN IN" />
              {this.renderError()}
              <div className={styles.relative}>
                {this.renderForm(handleSubmit)}
                {this.renderSocials()}
                {this.renderForgotPassword()}
              </div>
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
    errors.password =
      'Password must contain at least one number (0-9) and one uppercase letter (A-Z)';
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
    actions: bindActionCreators(actionCreators, dispatch),
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(
  reduxForm({
    form: 'signin',
    fields: ['email', 'password'],
    validate,
  })(Signin),
);
