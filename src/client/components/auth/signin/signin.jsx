import React, {PropTypes, Component} from 'react';
import { reduxForm } from 'redux-form';
import Input from '../../common/input';
import styles from './Signin.scss';
import Button from '../../common/button';
import MainHeading from './../../../components/common/mainheading';

/**
 * Signin component
 */
class Signin extends Component {
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }

    static propTypes = {
        fields: PropTypes.array.isRequired,
        handleSubmit: PropTypes.func.isRequired
    }

    handleFormSubmit({email, password}) {
        console.log(email, password);
    }

    render() {
            const {fields: {email, password}, handleSubmit} = this.props;

        return (
            <div className={styles.container}>
                <MainHeading text="SIGN IN"/>
                <form onSubmit={handleSubmit(this.handleFormSubmit)}>
                    <fieldset>
                        <Input {...email} label="Email" id="email" type="email" />
                    </fieldset>
                    <fieldset>
                        <Input {...password} label="password" id="password" type="password"/>
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

export default reduxForm({
    form: 'signin',
    fields: ['email', 'password']
})(Signin);