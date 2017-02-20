import React, { PropTypes } from 'react';
import styles from './Button.scss';
import classnames from 'classnames';

/**
 * Button component
 */
const Button = ({text, ariaLabel, color}) => {
    return (
        <button className={classnames(styles.button, styles[color])} role="button" aria-label={ariaLabel}>{text}</button>
    );
};

Button.propTypes = {
    text: PropTypes.string.isRequired,
    ariaLabel: PropTypes.string.isRequired,
    color: PropTypes.string
};

export default Button;