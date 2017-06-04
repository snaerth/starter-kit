import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import styles from './notifyBox.scss';
import classnames from 'classnames';
import { TweenMax } from 'gsap';

/**
 * Error component
 */
class Error extends Component {
  componentDidMount() {
    const node = ReactDOM.findDOMNode(this);
    TweenMax.fromTo(node, 0.5, { y: 10 }, { y: 0 });
  }

  checkBoxType(type) {
    switch (type) {
      case 'error':
        return styles.error;

      case 'success':
        return styles.success;

      default:
        return styles.error;
    }
  }

  render() {
    const { text, strongText, type } = this.props;

    return (
      <div className={classnames(styles.box, this.checkBoxType(type))}>
        {strongText ? <strong>{strongText}</strong> : null}
        {text}
      </div>
    );
  }
}

Error.propTypes = {
  strongText: PropTypes.string,
  text: PropTypes.string,
  type: PropTypes.string.isRequired
};

export default Error;
