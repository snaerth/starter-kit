import React from 'react';
import styles from './input.scss';

const Input = ({id, label}) => {
    return (
        <span className={styles.input}>
            <input className={styles.inputField} type="text" id={id}/>
            <label className={styles.inputLabel} htmlFor={id}>
                <span className={styles.inputLabelContent}>{label}</span>
            </label>
        </span>
    );
};

Input.propTypes = {
    id: React.PropTypes.string.isRequired,
    label: React.PropTypes.string.isRequired
};

export default Input;