import React, {PropTypes} from 'react';
import styles from './spinner.scss';

/**
 * Signup component
 */
const Spinner = props => {
    return (
        <div className={styles.spinner}>
            <div className={styles.ball}/>
            <p className={styles.text}>{props.children}</p>
        </div>
    );
};

Spinner.propTypes = {
    children: PropTypes.string
};

export default Spinner;
