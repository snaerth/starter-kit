import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import styles from './notfound.scss';

/**
 * Not Found component
 */
class NotFound extends Component {
  /**
   * Render method
   * @return {Component}
   */
  render() {
    return (
      <div className="container">
        <h2 className={styles.number}>Oops!</h2>
        <h3 className={styles.text}>
          We can't seem to find the page you're looking for.
        </h3>
        <p>Here are some links instead:</p>
        <div className={styles.linksContainer}>
          <div><Link to="/" className="link-slideright">Home</Link></div>
          <div>
            <Link to="signin" className="link-slideright">Sign in</Link>
          </div>
          <div>
            <Link to="signup" className="link-slideright">Sign up</Link>
          </div>
          <div>
            <Link to="profile" className="link-slideright">Profile</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default NotFound;
