import React, {PropTypes} from 'react';
import styles from './input.scss';

const Input = ({
    type,
    input,
    id,
    label,
    placeholder,
    error
}) => {
    return (
        <span className={styles.input}>
            {error
                ? (
                    <div className={styles.error} role="alert" aria-describedby={id}>
                        {error}
                    </div>
                )
                : ''}
            <input
                {...input}
                type={type}
                className={styles.inputField}
                id={id}
                name={id}
                placeholder={placeholder}/>
            <label className={styles.inputLabel} htmlFor={id}>
                <span className={styles.inputLabelContent}>{label}</span>
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
    placeholder: PropTypes.string
};

export default Input;