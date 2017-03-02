import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link, IndexLink } from 'react-router';
import styles from './header.scss';
import classnames from 'classnames';

/**
 * Header Component
 */
class Header extends Component {
    static propTypes = {
        authenticated: PropTypes.bool.isRequired,
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
            const links = [
                <Link to="/profile" key="profile" activeClassName={styles.active} className={styles.link}>Profile</Link>,
                <Link to="/signout" key="signout" activeClassName={styles.active} className={styles.link}>Sign out</Link>
            ];

            // Add admin link if user role is admin
            if(this.props.role && this.props.role === 'admin') {
                const adminLink = <Link to="/admin" key="admin" activeClassName={styles.active} className={styles.link}>Admin</Link>;
                links.unshift(adminLink);
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
            <nav className={styles.container}>
                <IndexLink
                    to="/"
                    activeClassName={styles.active}
                    className={classnames(styles.home_link, styles.link)}>Home</IndexLink>
                <div className={styles.links_right}>
                    {this.renderAuthLinks()}
                </div>
            </nav>
        );
    }
}

function mapStateToProps(state) {
    const {role, authenticated } = state.auth;

    if(role === 'admin') {
        return { authenticated,role};
    }

    return {authenticated};
}

export default connect(mapStateToProps)(Header);