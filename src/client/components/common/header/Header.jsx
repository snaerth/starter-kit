import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import styles from './Header.scss';
import classnames from 'classnames';

/**
 * Header Component
 */
class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool,
        role: PropTypes.string
    }

    /**
     * Renders auth links. If authenticated then signout link
     * else signin and signup
     * 
     * @returns {Component} Link 
     */
    renderAuthLinks() {
        if (this.props.authenticated) {
            let links = [
                <Link to="/profile" key="profile" activeClassName={styles.active} className={styles.link}>Profile</Link>,
                <Link to="/signout" key="signout" activeClassName={styles.active} className={styles.link}>Sign out</Link>
            ];

            if(this.props.role && this.props.role === 'admin') {
                links.unshift(<Link to="/admin" key="admin" activeClassName={styles.active} className={styles.link}>Admin</Link>);
            }

            return links;
        } else {
            return [
                <Link to="/signin" key="signin" activeClassName={styles.active} className={styles.link}>Sign in</Link>,
                <Link to="/signup" key="signup" activeClassName={styles.active} className={styles.link}>Sign up</Link>
            ];
        }
    }

    render() {
        return (
            <div className={styles.container}>
                <nav className={styles.containerInner}>
                    <div>
                        <IndexLink
                            to="/"
                            activeClassName={styles.active}
                            className={classnames(styles.home_link, styles.link)}>Home</IndexLink>
                    </div>
                    <div className={styles.links_right}>
                        {this.renderAuthLinks()}
                    </div>
                </nav>
            </div>
        );
    }
}

function mapStateToProps(state) {
    const {authenticated, role} = state.auth;
    let newStateToProps = {
        authenticated
    };

    if (role) {
        newStateToProps.role = role;
    }

    return newStateToProps;
}

export default connect(mapStateToProps)(Header);