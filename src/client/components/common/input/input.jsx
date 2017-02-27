import React, {PropTypes} from 'react';
import styles from './input.scss';
import ErrorText from '../errorText';

const Input = props => {
    return (
        <span className={styles.input}>
            {(props.meta.error && props.meta.touched) ? <ErrorText error={props.meta.error} id={props.id}/>: ''}
            <input
                {...props.input}
                type={props.type}
                className={styles.inputField}
                id={props.id}
                name={props.id}
                placeholder={props.placeholder}/>
            <label className={styles.inputLabel} htmlFor={props.id}>
                <span className={styles.inputLabelContent}>{props.label}</span>
            </label>
        </span>
    );
};

Input.propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    input: PropTypes.object,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    touched: PropTypes.bool,
    meta: PropTypes.object
};

export default Input;