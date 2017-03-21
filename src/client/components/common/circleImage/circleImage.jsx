import React, { PropTypes } from 'react';
import styles from './circleImage.scss';
import classnames from 'classnames';

/**
 * Button component
 */
const CircleImage = ({src, alt, className}) => {
    return (
        <img src={src} alt={alt} className={classnames(className || '', styles.circle)}/>
    );
};

CircleImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string
};

export default CircleImage;