import React, {PropTypes} from 'react';
import styles from './MainHeading.scss';

/**
 * Main heading component
 */
const MainHeading = ({text}) => {
    return (
        <h1 className={styles.heading}>{text}</h1>
    );
};

MainHeading.propTypes = {
    text: PropTypes.string.isRequired
};

export default MainHeading;