import React from 'react';
import PropTypes from 'prop-types';
import styles from '../input/input.scss';
import ErrorText from '../errorText';
import { CSSTransitionGroup } from 'react-transition-group';

const Input = props => {
  return (
    <span className={styles.input}>
      <CSSTransitionGroup
        component="div"
        transitionName="fadeIn"
        transitionEnterTimeout={700}
        transitionLeaveTimeout={350}
      >
        {props.meta.error && props.meta.touched
          ? <ErrorText key={props.id} id={props.id} error={props.meta.error} />
          : null}
      </CSSTransitionGroup>
      <textarea
        {...props.input}
        className={styles.inputField}
        id={props.id}
        placeholder={props.placeholder}
      />
      <label className={styles.inputLabel} htmlFor={props.id}>
        <span className={styles.inputLabelContent}>{props.label}</span>
      </label>
    </span>
  );
};

Input.propTypes = {
  id: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  placholder: PropTypes.string,
  input: PropTypes.object,
  error: PropTypes.string,
  placeholder: PropTypes.string,
  touched: PropTypes.bool,
  meta: PropTypes.object
};

export default Input;
