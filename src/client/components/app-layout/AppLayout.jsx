import React, { Component, PropTypes } from 'react';
import s from './AppLayout.scss';

export default class AppLayout extends Component {
  render() {
    return (
      <div className={s.layout}>
        {this.props.children}
      </div>
    );
  }
}

AppLayout.propTypes = {
  children: PropTypes.node
};