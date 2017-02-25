import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './signin.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';
import Error from '../../common/error';
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
            <div className={styles.container}>
                <MainHeading text="SIGN IN"/> {this.renderError()}
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
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
                        <div>
                            <Button text="Send" ariaLabel="Send" className="fullWidth"/>
                        </div>
                    </fieldset>
                </form>
            </div>
        );
    }
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
    fields: ['email', 'password']
})(Signin));
