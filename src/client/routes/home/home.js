import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class HomePage extends Component {
  render() {
    return (
      <div className="container">
        <div>Setja stuff hér</div>
        <Link to="/signin">
          Sign in
        </Link>,
      </div>
    );
  }
}

export default HomePage;
