import React, { PropTypes } from 'react';
import styles from './circleImage.scss';
import classnames from 'classnames';

/**
 * Button component
 */
const CircleImage = ({ src, alt, className, onClick }) => {
    return (
        <div style={{ backgroundImage: `url(${src})`}}
            role="img"
            aria-label={alt}
            onClick={onClick}
            className={classnames(className || '', styles.circle)} />
    );
};

CircleImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    className: PropTypes.string,
    onClick: PropTypes.func
};

export default CircleImage;