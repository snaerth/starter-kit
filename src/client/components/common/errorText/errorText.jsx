import React, { PropTypes } from 'react';
import styles from './errorText.scss';

const ErrorText = ({error, id}) => {
    return <div className={styles.error} role="alert" aria-describedby={id}>{error}</div>;
};

ErrorText.propTypes = {
    id: PropTypes.string,
    error: PropTypes.string
};

export default ErrorText;