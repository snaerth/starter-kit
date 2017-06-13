import React, { Component } from 'react';
import PropTypes from 'prop-types';
import styles from './password.scss';
import ErrorText from '../errorText';
import CSSTransitionGroup from 'react-transition-group';
import VisibilitySvg from './visibility.svg';
import VisibilityOffSvg from './visibility_off.svg';

class Password extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    placholder: PropTypes.string,
    type: PropTypes.string.isRequired,
    input: PropTypes.object,
    error: PropTypes.string,
    placeholder: PropTypes.string,
    touched: PropTypes.bool,
    meta: PropTypes.object,
    autocomplete: PropTypes.string,
    passwordVisibility: PropTypes.bool
  };

  constructor(props) {
    super(props);
    this.state = { passwordVisibility: false, type: 'password' };
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  /**
     * Toggles passwordVisibility state and input type
     */
  toggleVisibility = () => {
    let { passwordVisibility, type } = this.state;
    type = passwordVisibility ? 'password' : 'text';

    this.setState({
      passwordVisibility: !passwordVisibility,
      type
    });
  };

  render() {
    return (
      <div>
        <CSSTransitionGroup 
          component="div"
          transitionName="fadeIn"
          transitionEnterTimeout={700}
          transitionLeaveTimeout={350}
        >
          {this.props.meta.error && this.props.meta.touched
            ? <ErrorText
                key={this.props.id}
                id={this.props.id}
                error={this.props.meta.error}
              />
            : null}
        </CSSTransitionGroup>
        <span className={styles.input}>
          <span className={styles.icon} onClick={this.toggleVisibility}>
            {!this.state.passwordVisibility
              ? <VisibilitySvg />
              : <VisibilityOffSvg />}
          </span>
          <input
            {...this.props.input}
            type={this.state.type}
            className={styles.inputField}
            id={this.props.id}
            name={this.props.id}
            placeholder={this.props.placeholder}
            autoComplete={this.props.autocomplete || 'off'}
          />
          <label className={styles.inputLabel} htmlFor={this.props.id}>
            <span className={styles.inputLabelContent}>{this.props.label}</span>
          </label>
        </span>
      </div>
    );
  }
}

export default Password;
