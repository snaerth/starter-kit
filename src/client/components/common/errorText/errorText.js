import React, { PropTypes } from 'react';
import styles from './errorText.scss';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

const ErrorText = ({ error, id }) => {
  return (
    <ReactCSSTransitionGroup
      transitionName="fadeIn"
      transitionEnterTimeout={700}
      transitionLeaveTimeout={700}
    >
      <div key={id} className={styles.error} role="alert" aria-describedby={id}>
        {error}
      </div>
    </ReactCSSTransitionGroup>
  );
};

ErrorText.propTypes = {
  id: PropTypes.string,
  error: PropTypes.string
};

export default ErrorText;
