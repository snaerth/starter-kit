import React, { PropTypes } from 'react';
import styles from './button.scss';
import classnames from 'classnames';

/**
 * Button component
 */
const Button = props => {
  const { text, ariaLabel, color, className, onClick, type } = props;
  return (
    <button
      className={classnames(
        styles.button,
        styles[color ? color : 'default'],
        styles[className]
      )}
      role="button"
      type={type ? type : 'submit'}
      aria-label={ariaLabel}
      onClick={onClick}
    >
      {text}
      <span className={styles.icon}>{props.children}</span>
    </button>
  );
};

Button.propTypes = {
  text: PropTypes.string.isRequired,
  ariaLabel: PropTypes.string.isRequired,
  color: PropTypes.string,
  className: PropTypes.string,
  onClick: PropTypes.func,
  type: PropTypes.string,
  children: PropTypes.element
};

export default Button;
