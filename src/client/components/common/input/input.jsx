import React, {PropTypes} from 'react';
import styles from './input.scss';

const Input = ({id, label, placholder, type}) => {
    return (
        <span className={styles.input}>
            <input
                type={type}
                className={styles.inputField}
                type="text"
                id={id}
                placeholder={placholder}/>
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
    type: PropTypes.string.isRequired
};

export default Input;