import React, {PropTypes, Component} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {reduxForm, Field} from 'redux-form';
import Input from '../../common/input';
import styles from './signin.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';
import * as actionCreators from './../../../actions';

/**
 * Signin component
 */
class Signin extends Component {
    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired,
        signinUser: PropTypes.func,
        actions: PropTypes.object.isRequired
    }

    handleFormSubmit({email, password}) {
        this
            .props
            .actions
            .signinUser({email, password});
    }

    render() {
        const {handleSubmit} = this.props;

        return (
            <div className={styles.container}>
                <MainHeading text="SIGN IN"/>
                <form onSubmit={handleSubmit(this.handleFormSubmit.bind(this))}>
                    <fieldset>
                        <Field component={Input} name="email" id="email" type="email" label="Email"/>
                    </fieldset>
                    <fieldset>
                        <Field component={Input} name="password"id="password" type="password" label="Password"/>
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

function mapDispatchToProps(dispatch) {
    return {
        actions: bindActionCreators(actionCreators, dispatch)
    };
}

export default connect(null, mapDispatchToProps)(reduxForm({
    form: 'signin',
    fields: ['email', 'password']
})(Signin));
