import React, {PropTypes} from 'react';
import styles from './input.scss';

const Input = props => {
    return (
        <span className={styles.input}>
            <input
                type={props.type}
                className={styles.inputField}
                id={props.id}
                placeholder={props.placholder}/>
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
    type: PropTypes.string.isRequired
};

export default Input;