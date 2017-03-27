import React, { PropTypes } from 'react';
import styles from './buttonLink.scss';
import classnames from 'classnames';

/**
 * ButtonLink component
 */
const ButtonLink = (props) => {
    const {href, text, title, color, className} = props;
    return (
        <a className={classnames(styles.button, styles[color ? color: 'default'], styles[className] )} 
            href={href}
            title={title}>
            {text}
            <span className={styles.icon}>{props.children}</span>
        </a>
    );
};

ButtonLink.propTypes = {
    href: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    color: PropTypes.string,
    className: PropTypes.string,
    children: PropTypes.element
};

export default ButtonLink;