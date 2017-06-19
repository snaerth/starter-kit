import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { TimelineLite, Power3 } from 'gsap';
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
		fields: PropTypes.array.isRequired,
		handleSubmit: PropTypes.func.isRequired,
		signinUser: PropTypes.func,
		actions: PropTypes.object.isRequired,
		errorMessage: PropTypes.string,
		isFetching: PropTypes.bool
	};

	constructor(props) {
		super(props);

		this.handleFormSubmit = this.handleFormSubmit.bind(this);
		this.toggleView = this.toggleView.bind(this);

		this.state = {
			currentSlide: 0,
			animateButtons: false
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
     * 
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
	animateStart() {
		const { buttons } = this.refs;
		const tl = new TimelineLite();

		tl.staggerFrom(
			buttons.children,
			1,
			{ opacity: 0, delay: 0.1, ease: Power3.easeOut },
			0.1
		);
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

	/**
     * Toggles signin views BUTTONS or SIGN IN with email
     * 
	 * @param {Object} e - Click handler event
     * @returns {undefined}
     * @author Snær Seljan Þóroddsson
     */
	toggleView(e, slideNumber) {
		e.preventDefault();
		const { slideDirty } = this.state;
		let { currentSlide } = this.state;
		const { form, buttons } = this.refs;

		currentSlide = slideNumber;

		this.setState({ currentSlide });

		if (slideNumber !== 0) {
			this.animateSlide(buttons, form, true);
		} else {
			this.animateSlide(buttons, form, false);
		}
	}

	/**
     * Animates slidein 
     * 
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
					ease: Power3.easeOut
				})
				.to(secondEl, 0.2, {
					x: '0%',
					opacity: 1,
					ease: Power3.easeOut
				});
		} else {
			tl
				.to(secondEl, 0.2, {
					x: '110%',
					opacity: 1,
					ease: Power3.easeOut
				})
				.to(firstEl, 0.2, {
					x: '0%',
					opacity: 1,
					ease: Power3.easeOut
				});
		}
	}

	/**
     * Renders sign in form with email and password
     * 
	 * @param {func} handleSubmit
     * @returns {undefined}
     */
	renderForm(handleSubmit) {
		const {
			forgotPasswordContainer,
			formContainer,
			iconArrowForward,
			back
		} = styles;

		return (
			<form
				onSubmit={handleSubmit(this.handleFormSubmit)}
				noValidate
				ref="form"
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
				<div className={forgotPasswordContainer}>
					<Link
						role="button"
						to="forgotpassword"
						className="link-slideright"
						onClick={e => this.toggleView(e, 2)}
					>
						Forgot password?
					</Link>
				</div>
				<div className={back}>
					<Link
						to="/"
						role="button"
						className="link-slideright"
						onClick={e => this.toggleView(e, 0)}
					>
						Back to socials sign in
					</Link>
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
		const {
			buttonContainer,
			hidden,
			iconFacebook,
			iconArrowForward,
			forgotPasswordContainer
		} = styles;
		const { animateButtons } = this.state;

		return (
			<div
				className={classnames(buttonContainer, !animateButtons ? hidden : '')}
				ref="buttons"
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
				<div onClick={e => this.toggleView(e, 1)}>
					<ButtonLink
						role="button"
						text="Sign in with email"
						title="Sign in with email"
						className="fullWidth"
					>
						<ArrowForward className={iconArrowForward} />
					</ButtonLink>
				</div>
			</div>
		);
	}

	/**
     * Renders ForgotPassword component
     * 
     * @returns {undefined}
     */
	renderForgotPassword() {
		const { formContainer } = styles;

		return (
			<div ref="forgotpassword" className={formContainer}>
				<ForgotPassword hideHeading={true} />
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
		actions: bindActionCreators(actionCreators, dispatch)
	};
}

export default connect(mapStateToProps, mapDispatchToProps)(
	reduxForm({
		form: 'signin',
		fields: ['email', 'password'],
		validate
	})(Signin)
);
